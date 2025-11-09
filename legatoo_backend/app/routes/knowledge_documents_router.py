"""
Knowledge documents router.

Provides admin endpoints to list knowledge documents stored in the system.
"""

from typing import Optional
import logging

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from ..db.database import get_db
from ..schemas.response import (
    ApiResponse,
    create_error_response,
    create_success_response,
)
from ..services.legal.knowledge.knowledge_document_service import (
    KnowledgeDocumentService,
)
from ..utils.auth import TokenData, get_current_user

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/documents", tags=["documents"])


def get_document_service(
    db: AsyncSession = Depends(get_db),
) -> KnowledgeDocumentService:
    """Dependency injector for knowledge document service."""
    return KnowledgeDocumentService(db)


@router.get("", response_model=ApiResponse)
async def list_documents(
    page: int = Query(1, ge=1, description="Page number (1-indexed)"),
    page_size: int = Query(
        20, ge=1, le=200, description="Number of documents per page"
    ),
    category: Optional[str] = Query(None, description="Filter by document category"),
    status_filter: Optional[str] = Query(
        None, alias="status", description="Filter by document status"
    ),
    uploaded_by: Optional[int] = Query(
        None, description="Filter by uploader user ID"
    ),
    search: Optional[str] = Query(
        None, description="Search in title or file path (case-insensitive)"
    ),
    current_user: TokenData = Depends(get_current_user),
    service: KnowledgeDocumentService = Depends(get_document_service),
) -> ApiResponse:
    """
    List knowledge documents with optional filters.

    Restricted to admin or super_admin users.
    """
    if current_user.role not in {"admin", "super_admin"}:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=create_error_response(
                message="Access denied",
                errors=[{"field": "auth", "message": "Admin access required"}],
            ).model_dump(),
        )

    try:
        data = await service.list_documents(
            page=page,
            page_size=page_size,
            category=category,
            status=status_filter,
            uploaded_by=uploaded_by,
            search=search,
        )
        return create_success_response(
            message="Documents retrieved successfully",
            data=data,
        )
    except Exception as exc:
        logger.exception("Failed to list knowledge documents: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=create_error_response(
                message="Failed to retrieve documents",
                errors=[{"field": None, "message": str(exc)}],
            ).model_dump(),
        )

