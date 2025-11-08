"""add_contracts_library_tables

Revision ID: 013_add_contracts_library
Revises: 012_add_analytics
Create Date: 2025-01-17 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import sqlite

# revision identifiers, used by Alembic.
revision = '013_add_contracts_library'
down_revision = '012_add_analytics'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Check if tables exist before creating them (handles case where create_tables already created them)
    from sqlalchemy import inspect
    bind = op.get_bind()
    inspector = inspect(bind)
    existing_tables = inspector.get_table_names()
    
    # Create contracts_library table
    if 'contracts_library' not in existing_tables:
        op.create_table(
            'contracts_library',
            sa.Column('id', sa.String(), nullable=False),
            sa.Column('title', sa.String(length=500), nullable=False),
            sa.Column('category', sa.String(length=100), nullable=True),
            sa.Column('jurisdiction', sa.String(length=100), nullable=True),
            sa.Column('language', sa.String(length=10), server_default='en', nullable=False),
            sa.Column('status', sa.String(length=20), server_default='draft', nullable=False),
            sa.Column('version', sa.Integer(), server_default='1', nullable=False),
            sa.Column('ai_generated', sa.Boolean(), server_default='0', nullable=False),
            sa.Column('content', sa.Text(), nullable=True),
            sa.Column('created_by', sa.Integer(), nullable=False),
            sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=False),
            sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
            sa.ForeignKeyConstraint(['created_by'], ['users.id'], ),
            sa.PrimaryKeyConstraint('id')
        )
        # Create indexes
        op.create_index(op.f('ix_contracts_library_title'), 'contracts_library', ['title'], unique=False)
        op.create_index(op.f('ix_contracts_library_category'), 'contracts_library', ['category'], unique=False)
        op.create_index(op.f('ix_contracts_library_jurisdiction'), 'contracts_library', ['jurisdiction'], unique=False)
        op.create_index(op.f('ix_contracts_library_status'), 'contracts_library', ['status'], unique=False)
        op.create_index(op.f('ix_contracts_library_created_by'), 'contracts_library', ['created_by'], unique=False)
    else:
        # Create indexes if they don't exist
        indexes = [
            ('ix_contracts_library_title', 'title'),
            ('ix_contracts_library_category', 'category'),
            ('ix_contracts_library_jurisdiction', 'jurisdiction'),
            ('ix_contracts_library_status', 'status'),
            ('ix_contracts_library_created_by', 'created_by')
        ]
        for index_name, column in indexes:
            try:
                op.create_index(op.f(index_name), 'contracts_library', [column], unique=False)
            except:
                pass
    
    # Create contract_templates_library table
    if 'contract_templates_library' not in existing_tables:
        op.create_table(
            'contract_templates_library',
            sa.Column('id', sa.String(), nullable=False),
            sa.Column('name', sa.String(length=300), nullable=False),
            sa.Column('description', sa.Text(), nullable=True),
            sa.Column('tags', sqlite.JSON(), nullable=True),
            sa.Column('content', sa.Text(), nullable=False),
            sa.Column('language', sa.String(length=10), server_default='en', nullable=False),
            sa.Column('jurisdiction', sa.String(length=100), nullable=True),
            sa.Column('is_public', sa.Boolean(), server_default='0', nullable=False),
            sa.Column('created_by', sa.Integer(), nullable=False),
            sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=False),
            sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
            sa.ForeignKeyConstraint(['created_by'], ['users.id'], ),
            sa.PrimaryKeyConstraint('id')
        )
        # Create indexes
        op.create_index(op.f('ix_contract_templates_library_name'), 'contract_templates_library', ['name'], unique=False)
        op.create_index(op.f('ix_contract_templates_library_jurisdiction'), 'contract_templates_library', ['jurisdiction'], unique=False)
        op.create_index(op.f('ix_contract_templates_library_is_public'), 'contract_templates_library', ['is_public'], unique=False)
        op.create_index(op.f('ix_contract_templates_library_created_by'), 'contract_templates_library', ['created_by'], unique=False)
    else:
        # Create indexes if they don't exist
        indexes = [
            ('ix_contract_templates_library_name', 'name'),
            ('ix_contract_templates_library_jurisdiction', 'jurisdiction'),
            ('ix_contract_templates_library_is_public', 'is_public'),
            ('ix_contract_templates_library_created_by', 'created_by')
        ]
        for index_name, column in indexes:
            try:
                op.create_index(op.f(index_name), 'contract_templates_library', [column], unique=False)
            except:
                pass
    
    # Create contract_revisions table
    if 'contract_revisions' not in existing_tables:
        op.create_table(
            'contract_revisions',
            sa.Column('id', sa.String(), nullable=False),
            sa.Column('contract_id', sa.String(), nullable=False),
            sa.Column('revision_number', sa.Integer(), nullable=False),
            sa.Column('changes_summary', sa.Text(), nullable=True),
            sa.Column('updated_content', sa.Text(), nullable=False),
            sa.Column('updated_by', sa.Integer(), nullable=False),
            sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=False),
            sa.ForeignKeyConstraint(['contract_id'], ['contracts_library.id'], ),
            sa.ForeignKeyConstraint(['updated_by'], ['users.id'], ),
            sa.PrimaryKeyConstraint('id')
        )
        # Create indexes
        op.create_index(op.f('ix_contract_revisions_contract_id'), 'contract_revisions', ['contract_id'], unique=False)
    else:
        # Create index if it doesn't exist
        try:
            op.create_index(op.f('ix_contract_revisions_contract_id'), 'contract_revisions', ['contract_id'], unique=False)
        except:
            pass
    
    # Create contract_ai_requests table
    if 'contract_ai_requests' not in existing_tables:
        op.create_table(
            'contract_ai_requests',
            sa.Column('id', sa.String(), nullable=False),
            sa.Column('user_id', sa.Integer(), nullable=False),
            sa.Column('prompt_text', sa.Text(), nullable=False),
            sa.Column('ai_model', sa.String(length=50), server_default='gemini-2.0-flash-exp', nullable=False),
            sa.Column('generated_content', sa.Text(), nullable=True),
            sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=False),
            sa.Column('used_in_contract_id', sa.String(), nullable=True),
            sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
            sa.ForeignKeyConstraint(['used_in_contract_id'], ['contracts_library.id'], ),
            sa.PrimaryKeyConstraint('id')
        )
        # Create indexes
        op.create_index(op.f('ix_contract_ai_requests_user_id'), 'contract_ai_requests', ['user_id'], unique=False)
        op.create_index(op.f('ix_contract_ai_requests_used_in_contract_id'), 'contract_ai_requests', ['used_in_contract_id'], unique=False)
    else:
        # Create indexes if they don't exist
        indexes = [
            ('ix_contract_ai_requests_user_id', 'user_id'),
            ('ix_contract_ai_requests_used_in_contract_id', 'used_in_contract_id')
        ]
        for index_name, column in indexes:
            try:
                op.create_index(op.f(index_name), 'contract_ai_requests', [column], unique=False)
            except:
                pass


def downgrade() -> None:
    # Drop indexes first
    try:
        op.drop_index(op.f('ix_contract_ai_requests_used_in_contract_id'), table_name='contract_ai_requests')
    except:
        pass
    try:
        op.drop_index(op.f('ix_contract_ai_requests_user_id'), table_name='contract_ai_requests')
    except:
        pass
    try:
        op.drop_index(op.f('ix_contract_revisions_contract_id'), table_name='contract_revisions')
    except:
        pass
    try:
        op.drop_index(op.f('ix_contract_templates_library_created_by'), table_name='contract_templates_library')
    except:
        pass
    try:
        op.drop_index(op.f('ix_contract_templates_library_is_public'), table_name='contract_templates_library')
    except:
        pass
    try:
        op.drop_index(op.f('ix_contract_templates_library_jurisdiction'), table_name='contract_templates_library')
    except:
        pass
    try:
        op.drop_index(op.f('ix_contract_templates_library_name'), table_name='contract_templates_library')
    except:
        pass
    try:
        op.drop_index(op.f('ix_contracts_library_created_by'), table_name='contracts_library')
    except:
        pass
    try:
        op.drop_index(op.f('ix_contracts_library_status'), table_name='contracts_library')
    except:
        pass
    try:
        op.drop_index(op.f('ix_contracts_library_jurisdiction'), table_name='contracts_library')
    except:
        pass
    try:
        op.drop_index(op.f('ix_contracts_library_category'), table_name='contracts_library')
    except:
        pass
    try:
        op.drop_index(op.f('ix_contracts_library_title'), table_name='contracts_library')
    except:
        pass
    
    # Drop tables
    op.drop_table('contract_ai_requests')
    op.drop_table('contract_revisions')
    op.drop_table('contract_templates_library')
    op.drop_table('contracts_library')
