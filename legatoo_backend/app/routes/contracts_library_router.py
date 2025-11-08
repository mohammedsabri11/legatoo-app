"""
Contracts Library API Router

RESTful endpoints for managing contracts, templates, revisions, and AI generation.
"""

from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession

from ..db.database import get_db
from ..utils.auth import get_current_user
from ..schemas.profile_schemas import TokenData
from ..schemas.contracts_library import (
    ContractCreate, ContractUpdate, ContractResponse, ContractListResponse,
    TemplateCreate, TemplateUpdate, TemplateResponse,
    RevisionCreate, RevisionHistoryResponse,
    AIGenerateRequest, AIGenerateResponse,
    ContractFilters, TemplateFilters
)
from ..services.contracts.contracts_library_service import ContractsLibraryService

router = APIRouter(prefix="/contracts", tags=["contracts"])


# ============ Contract Endpoints ============

@router.post("", response_model=ContractResponse, status_code=status.HTTP_201_CREATED)
async def create_contract(
    contract_data: ContractCreate,
    current_user: TokenData = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a new contract."""
    service = ContractsLibraryService(db)
    try:
        contract = await service.create_contract(contract_data, current_user.sub)
        return contract
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.get("", response_model=ContractListResponse)
async def list_contracts(
    category: Optional[str] = Query(None),
    jurisdiction: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    language: Optional[str] = Query(None),
    ai_generated: Optional[bool] = Query(None),
    search_query: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    current_user: TokenData = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """List contracts with filtering and pagination."""
    filters = ContractFilters(
        category=category,
        jurisdiction=jurisdiction,
        status=status,
        language=language,
        ai_generated=ai_generated,
        search_query=search_query,
        page=page,
        page_size=page_size
    )
    service = ContractsLibraryService(db)
    try:
        result = await service.list_contracts(filters, current_user.sub)
        return result
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.get("/{contract_id}", response_model=ContractResponse)
async def get_contract(
    contract_id: str,
    current_user: TokenData = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get contract by ID."""
    service = ContractsLibraryService(db)
    try:
        # Ensure user_id is an int (handle both int and UUID types from TokenData)
        user_id = int(current_user.sub) if isinstance(current_user.sub, (int, str)) and str(current_user.sub).isdigit() else None
        
        contract = await service.get_contract(contract_id, user_id)
        if not contract:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, 
                detail=f"Contract with ID '{contract_id}' not found"
            )
        return contract
    except ValueError as e:
        if "Access denied" in str(e):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e))
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.put("/{contract_id}", response_model=ContractResponse)
async def update_contract(
    contract_id: str,
    update_data: ContractUpdate,
    current_user: TokenData = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update contract."""
    service = ContractsLibraryService(db)
    try:
        contract = await service.update_contract(contract_id, update_data, current_user.sub)
        if not contract:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Contract not found")
        return contract
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.delete("/{contract_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_contract(
    contract_id: str,
    current_user: TokenData = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Soft delete (archive) contract."""
    service = ContractsLibraryService(db)
    try:
        success = await service.delete_contract(contract_id, current_user.sub)
        if not success:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Contract not found")
        return None
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


# ============ AI Generation Endpoints ============

@router.post("/generate", response_model=AIGenerateResponse, status_code=status.HTTP_201_CREATED)
async def generate_contract_with_ai(
    request: AIGenerateRequest,
    current_user: TokenData = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Generate a contract using AI."""
    service = ContractsLibraryService(db)
    try:
        result = await service.generate_contract_with_ai(request, current_user.sub)
        return result
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.post("/generate/{request_id}/save", response_model=ContractResponse, status_code=status.HTTP_201_CREATED)
async def save_ai_generated_contract(
    request_id: str,
    contract_data: ContractCreate,
    current_user: TokenData = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Save AI-generated content as a contract."""
    service = ContractsLibraryService(db)
    try:
        contract = await service.save_ai_generated_contract(request_id, contract_data, current_user.sub)
        return contract
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


# ============ Revision Endpoints ============

@router.get("/{contract_id}/history", response_model=RevisionHistoryResponse)
async def get_revision_history(
    contract_id: str,
    current_user: TokenData = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get revision history for a contract."""
    service = ContractsLibraryService(db)
    try:
        history = await service.get_revision_history(contract_id, current_user.sub)
        return history
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.post("/{contract_id}/revise", response_model=ContractResponse, status_code=status.HTTP_201_CREATED)
async def create_revision(
    contract_id: str,
    revision_data: RevisionCreate,
    current_user: TokenData = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a new revision for a contract."""
    from ..schemas.contracts_library import RevisionResponse
    service = ContractsLibraryService(db)
    try:
        revision = await service.create_revision(contract_id, revision_data, current_user.sub)
        # Return updated contract
        contract = await service.get_contract(contract_id, current_user.sub)
        return contract
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


# ============ Template Endpoints ============

@router.post("/templates", response_model=TemplateResponse, status_code=status.HTTP_201_CREATED)
async def create_template(
    template_data: TemplateCreate,
    current_user: TokenData = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a new contract template."""
    service = ContractsLibraryService(db)
    try:
        template = await service.create_template(template_data, current_user.sub)
        return template
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.get("/templates", response_model=dict)
async def list_templates(
    category: Optional[str] = Query(None),
    jurisdiction: Optional[str] = Query(None),
    language: Optional[str] = Query(None),
    is_public: Optional[bool] = Query(None),
    tags: Optional[str] = Query(None),  # Comma-separated tags
    search_query: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    current_user: Optional[TokenData] = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """List contract templates with filtering."""
    tag_list = tags.split(",") if tags else None
    filters = TemplateFilters(
        category=category,
        jurisdiction=jurisdiction,
        language=language,
        is_public=is_public,
        tags=tag_list,
        search_query=search_query,
        page=page,
        page_size=page_size
    )
    service = ContractsLibraryService(db)
    try:
        user_id = current_user.sub if current_user else None
        result = await service.list_templates(filters, user_id)
        return result
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.get("/templates/{template_id}", response_model=TemplateResponse)
async def get_template(
    template_id: str,
    current_user: Optional[TokenData] = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get template by ID."""
    service = ContractsLibraryService(db)
    try:
        user_id = current_user.sub if current_user else None
        template = await service.get_template(template_id, user_id)
        if not template:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Template not found")
        return template
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.put("/templates/{template_id}", response_model=TemplateResponse)
async def update_template(
    template_id: str,
    update_data: TemplateUpdate,
    current_user: TokenData = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update template."""
    service = ContractsLibraryService(db)
    try:
        template = await service.update_template(template_id, update_data, current_user.sub)
        if not template:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Template not found")
        return template
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.delete("/templates/{template_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_template(
    template_id: str,
    current_user: TokenData = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete template."""
    service = ContractsLibraryService(db)
    try:
        success = await service.delete_template(template_id, current_user.sub)
        if not success:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Template not found")
        return None
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.post("/templates/{template_id}/generate", response_model=ContractResponse, status_code=status.HTTP_201_CREATED)
async def generate_from_template(
    template_id: str,
    placeholder_data: dict,
    current_user: TokenData = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Generate a contract from a template by replacing placeholders."""
    service = ContractsLibraryService(db)
    try:
        contract = await service.generate_from_template(template_id, placeholder_data, current_user.sub)
        return contract
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


# ============ Export Endpoints ============

@router.get("/{contract_id}/export")
async def export_contract(
    contract_id: str,
    format: str = Query("pdf", regex="^(pdf|docx)$"),
    current_user: TokenData = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Export contract as PDF or Word document with Arabic support."""
    from fastapi.responses import StreamingResponse, Response
    from io import BytesIO
    from urllib.parse import quote
    import os
    from pathlib import Path
    
    service = ContractsLibraryService(db)
    
    try:
        user_id = int(current_user.sub) if isinstance(current_user.sub, (int, str)) and str(current_user.sub).isdigit() else None
        contract = await service.get_contract(contract_id, user_id)
        
        if not contract:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Contract not found"
            )
        
        if not contract.content:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Contract has no content to export"
            )
        
        # Determine language (default to Arabic for RTL support)
        is_arabic = contract.language == "ar" if contract.language else True
        
        if format == "pdf":
            # Generate PDF
            try:
                from reportlab.lib.pagesizes import A4
                from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
                from reportlab.lib.units import inch
                from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
                from reportlab.lib.enums import TA_RIGHT, TA_LEFT
                
                buffer = BytesIO()
                
                # Create PDF with RTL-friendly margins
                doc = SimpleDocTemplate(
                    buffer,
                    pagesize=A4,
                    topMargin=0.75*inch,
                    bottomMargin=0.75*inch,
                    leftMargin=0.75*inch,
                    rightMargin=0.75*inch
                )
                styles = getSampleStyleSheet()
                
                # Register Arabic font
                arabic_font_name = None
                try:
                    from reportlab.pdfbase import pdfmetrics
                    from reportlab.pdfbase.ttfonts import TTFont
                    
                    app_dir = Path(__file__).parent.parent
                    fonts_dir = app_dir / "fonts"
                    
                    font_files = [
                        "NotoSansArabic-Regular.ttf",
                        "NotoSansArabic.ttf",
                        "DejaVuSans.ttf",
                    ]
                    
                    for font_file in font_files:
                        font_path = fonts_dir / font_file
                        if font_path.exists():
                            font_name = "ArabicFont"
                            pdfmetrics.registerFont(TTFont(font_name, str(font_path)))
                            arabic_font_name = font_name
                            break
                except Exception:
                    pass
                
                base_font = arabic_font_name if arabic_font_name else 'Helvetica'
                alignment = TA_RIGHT if is_arabic else TA_LEFT
                
                # Styles
                title_style = ParagraphStyle(
                    'ContractTitle',
                    parent=styles['Heading1'],
                    fontName=base_font,
                    fontSize=18,
                    textColor='#1f2937',
                    spaceAfter=12,
                    alignment=alignment
                )
                
                normal_style = ParagraphStyle(
                    'ContractNormal',
                    parent=styles['Normal'],
                    fontName=base_font,
                    fontSize=10,
                    textColor='#4b5563',
                    spaceAfter=6,
                    alignment=alignment,
                    leading=14
                )
                
                # Process Arabic text
                try:
                    import arabic_reshaper
                    from bidi.algorithm import get_display
                    ARABIC_AVAILABLE = True
                except ImportError:
                    ARABIC_AVAILABLE = False
                
                def prepare_text(text):
                    if not text:
                        return ""
                    text_str = str(text)
                    
                    # Process Arabic if available
                    if ARABIC_AVAILABLE and is_arabic:
                        if any('\u0600' <= char <= '\u06FF' for char in text_str):
                            reshaped = arabic_reshaper.reshape(text_str)
                            bidi_text = get_display(reshaped)
                            return '\u202E' + bidi_text + '\u202C'
                    
                    # Escape HTML
                    return (text_str.replace("&", "&amp;")
                            .replace("<", "&lt;")
                            .replace(">", "&gt;")
                            .replace("\n", "<br/>"))
                
                # Build PDF content
                story = []
                story.append(Paragraph(f"<b>{prepare_text(contract.title)}</b>", title_style))
                story.append(Spacer(1, 0.2*inch))
                
                # Add metadata
                if contract.category:
                    story.append(Paragraph(f"<b>Category:</b> {prepare_text(contract.category)}", normal_style))
                if contract.jurisdiction:
                    story.append(Paragraph(f"<b>Jurisdiction:</b> {prepare_text(contract.jurisdiction)}", normal_style))
                story.append(Spacer(1, 0.1*inch))
                
                # Add content (preserve line breaks)
                content_lines = contract.content.split('\n')
                for line in content_lines:
                    if line.strip():
                        story.append(Paragraph(prepare_text(line), normal_style))
                    else:
                        story.append(Spacer(1, 0.05*inch))
                
                doc.build(story)
                buffer.seek(0)
                
                safe_title = "".join(c for c in contract.title if c.isalnum() or c in (' ', '-', '_')).strip()
                safe_title = safe_title.encode('ascii', 'ignore').decode('ascii')
                filename = f"contract_{contract_id}_{safe_title}.pdf"
                encoded_filename = quote(filename, safe='')
                
                return StreamingResponse(
                    buffer,
                    media_type="application/pdf",
                    headers={
                        "Content-Disposition": f"attachment; filename*=UTF-8''{encoded_filename}"
                    }
                )
                
            except ImportError:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="PDF generation requires reportlab library"
                )
        
        elif format == "docx":
            # Generate Word document
            try:
                from docx import Document
                from docx.shared import Pt, Inches
                from docx.enum.text import WD_ALIGN_PARAGRAPH
                
                doc = Document()
                
                # Set RTL if Arabic
                if is_arabic:
                    # Set document direction to RTL
                    for section in doc.sections:
                        section.page_height = Inches(11.69)  # A4
                        section.page_width = Inches(8.27)
                
                # Title
                title_para = doc.add_heading(contract.title, 0)
                if is_arabic:
                    title_para.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.RIGHT
                
                # Metadata
                if contract.category or contract.jurisdiction:
                    doc.add_paragraph()
                    if contract.category:
                        p = doc.add_paragraph(f"Category: {contract.category}")
                        if is_arabic:
                            p.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.RIGHT
                    if contract.jurisdiction:
                        p = doc.add_paragraph(f"Jurisdiction: {contract.jurisdiction}")
                        if is_arabic:
                            p.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.RIGHT
                    doc.add_paragraph()
                
                # Content
                content_lines = contract.content.split('\n')
                for line in content_lines:
                    p = doc.add_paragraph(line)
                    if is_arabic:
                        p.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.RIGHT
                        # Set font for Arabic support
                        for run in p.runs:
                            run.font.name = 'Arial Unicode MS'
                
                buffer = BytesIO()
                doc.save(buffer)
                buffer.seek(0)
                
                safe_title = "".join(c for c in contract.title if c.isalnum() or c in (' ', '-', '_')).strip()
                safe_title = safe_title.encode('ascii', 'ignore').decode('ascii')
                filename = f"contract_{contract_id}_{safe_title}.docx"
                encoded_filename = quote(filename, safe='')
                
                return StreamingResponse(
                    buffer,
                    media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                    headers={
                        "Content-Disposition": f"attachment; filename*=UTF-8''{encoded_filename}"
                    }
                )
                
            except ImportError:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Word document generation requires python-docx library"
                )
        
    except HTTPException:
        raise
    except Exception as e:
        from ...config.enhanced_logging import get_logger
        logger = get_logger(__name__)
        logger.exception(f"Error exporting contract {contract_id}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to export contract: {str(e)}"
        )