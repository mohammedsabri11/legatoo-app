"""
Knowledge document service layer.

Provides business logic for listing and enriching knowledge documents
stored in the system (uploaded contracts, cases, laws, etc.).
"""

from __future__ import annotations

from typing import Any, Dict, List, Optional
import math

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from ....models.legal_knowledge import KnowledgeChunk, KnowledgeDocument
from ....models.user import User
from ....repositories.legal_knowledge_repository import KnowledgeDocumentRepository


class KnowledgeDocumentService:
    """Business logic for knowledge documents."""

    def __init__(self, db: AsyncSession):
        self.db = db
        self.documents_repo = KnowledgeDocumentRepository(db)

    async def list_documents(
        self,
        *,
        page: int = 1,
        page_size: int = 20,
        category: Optional[str] = None,
        status: Optional[str] = None,
        uploaded_by: Optional[int] = None,
        search: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Return paginated list of knowledge documents with rich metadata."""
        page = max(page, 1)
        page_size = max(min(page_size, 200), 1)  # prevent extreme values
        skip = (page - 1) * page_size

        documents, total = await self.documents_repo.get_documents(
            skip=skip,
            limit=page_size,
            category=category,
            status=status,
            uploaded_by=uploaded_by,
            search=search,
        )

        document_ids = [doc.id for doc in documents]

        chunk_counts = await self._get_chunk_counts(document_ids)
        uploaded_by_map = await self._get_uploaded_by_map(documents)
        status_counts = await self.documents_repo.get_document_status_counts(
            category=category,
            status=status,
            uploaded_by=uploaded_by,
            search=search,
        )
        category_counts = await self.documents_repo.get_document_category_counts(
            category=category,
            status=status,
            uploaded_by=uploaded_by,
            search=search,
        )

        items = [
            self._serialize_document(
                document=doc,
                chunk_counts=chunk_counts,
                uploaded_by_map=uploaded_by_map,
            )
            for doc in documents
        ]

        total_pages = math.ceil(total / page_size) if total and page_size else 1

        return {
            "documents": items,
            "pagination": {
                "page": page,
                "page_size": page_size,
                "total": total,
                "total_pages": total_pages,
            },
            "metrics": {
                "total_documents": total,
                "status_counts": status_counts,
                "category_counts": category_counts,
            },
        }

    async def _get_chunk_counts(self, document_ids: List[int]) -> Dict[int, int]:
        """Return chunk counts per document id."""
        if not document_ids:
            return {}

        result = await self.db.execute(
            select(KnowledgeChunk.document_id, func.count(KnowledgeChunk.id))
            .where(KnowledgeChunk.document_id.in_(document_ids))
            .group_by(KnowledgeChunk.document_id)
        )
        return {doc_id: count for doc_id, count in result.all()}

    async def _get_uploaded_by_map(
        self, documents: List[KnowledgeDocument]
    ) -> Dict[int, Dict[str, Any]]:
        """Fetch basic user info for uploaded_by references."""
        user_ids = {doc.uploaded_by for doc in documents if doc.uploaded_by}
        if not user_ids:
            return {}

        result = await self.db.execute(
            select(User.id, User.email, User.role).where(User.id.in_(user_ids))
        )
        return {
            row.id: {"id": row.id, "email": row.email, "role": row.role}
            for row in result.all()
        }

    def _serialize_document(
        self,
        *,
        document: KnowledgeDocument,
        chunk_counts: Dict[int, int],
        uploaded_by_map: Dict[int, Dict[str, Any]],
    ) -> Dict[str, Any]:
        """Convert ORM document into serializable payload."""
        metadata = document.document_metadata or {}

        original_filename = metadata.get("original_filename") or document.title
        file_size_bytes = metadata.get("file_size")
        file_size_mb = self._bytes_to_mb(file_size_bytes)
        tags_raw = metadata.get("tags") or []
        tags = self._normalize_tags(tags_raw)
        analysis = metadata.get("analysis") or {}
        file_type = metadata.get("file_type") or document.file_extension

        return {
            "id": document.id,
            "title": document.title,
            "original_filename": original_filename,
            "category": document.category,
            "status": document.status,
            "status_normalized": self._normalize_status(document.status),
            "source_type": document.source_type,
            "file_path": document.file_path,
            "file_extension": document.file_extension,
            "file_type": file_type,
            "file_size_bytes": file_size_bytes,
            "file_size_mb": file_size_mb,
            "tags": tags,
            "analysis": analysis or None,
            "metadata": metadata,
            "chunks_count": chunk_counts.get(document.id, 0),
            "uploaded_by": document.uploaded_by,
            "uploaded_by_user": uploaded_by_map.get(document.uploaded_by),
            "uploaded_at": document.uploaded_at.isoformat() if document.uploaded_at else None,
            "processed_at": document.processed_at.isoformat() if document.processed_at else None,
        }

    @staticmethod
    def _bytes_to_mb(value: Any) -> Optional[float]:
        """Convert a bytes value to MB with 2 decimal precision."""
        if value is None:
            return None

        numeric_value: Optional[float] = None
        if isinstance(value, (int, float)):
            numeric_value = float(value)
        elif isinstance(value, str):
            try:
                numeric_value = float(value)
            except ValueError:
                numeric_value = None

        if numeric_value is None:
            return None

        return round(numeric_value / (1024 * 1024), 2)

    @staticmethod
    def _normalize_tags(raw_tags: Any) -> List[str]:
        """Ensure tags are returned as a list of strings."""
        if isinstance(raw_tags, list):
            return [str(tag) for tag in raw_tags if tag is not None]
        if isinstance(raw_tags, str):
            return [raw_tags]
        return []

    @staticmethod
    def _normalize_status(status: Optional[str]) -> str:
        """Map database status values to UI-friendly statuses."""
        if not status:
            return "processing"

        status_lower = status.lower()
        if status_lower in {"processed", "indexed"}:
            return "processed"
        if status_lower in {"raw", "pending_parsing", "processing"}:
            return "processing"
        if status_lower in {"error", "failed"}:
            return "error"
        return status_lower

