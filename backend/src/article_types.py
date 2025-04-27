"""Article-related data models for API requests and responses."""

import enum
from src.util import CamelModel


class ComponentType(str, enum.Enum):
    """Enum for different types of article components."""
    TEXT = "text"
    IMAGE = "image"
    PROTEIN = "protein"


class ArticleImageComponent(CamelModel):
    """Represents an image component in an article."""
    id: int
    component_type: ComponentType = ComponentType.IMAGE
    component_order: int = 0
    src: str
    width: int
    height: int


class ArticleTextComponent(CamelModel):
    """Represents a text component in an article."""
    id: int
    component_type: ComponentType = ComponentType.TEXT
    component_order: int = 0
    markdown: str


class ArticleProteinComponent(CamelModel):
    """Represents a protein component in an article."""
    id: int
    component_type: ComponentType = ComponentType.PROTEIN
    component_order: int = 0
    name: str
    aligned_with_name: str


class ArticleEntry(CamelModel):
    """Represents an article with its components."""
    id: int
    title: str | None = None
    description: str | None = None
    date_published: str | None = None
    refs: str | None = None
    ordered_components: list[
        ArticleTextComponent | ArticleProteinComponent | ArticleImageComponent
    ]


class ArticleUploadBody(CamelModel):
    """Data model for uploading an article."""
    title: str
    description: str | None = None


class ArticleMetadataEditBody(CamelModel):
    """Data model for editing article metadata."""
    article_title: str
    new_article_title: str | None = None
    new_description: str | None = None
    new_refs: str | None = None


class ArticleTextUploadBody(CamelModel):
    """Data model for uploading text components to an article."""
    article_id: int
    markdown: str


class ArticleTextEditBody(CamelModel):
    """Data model for editing text components in an article."""
    component_id: int
    new_markdown: str


class ArticleProteinUploadBody(CamelModel):
    """Data model for uploading protein components to an article."""
    article_id: int
    name: str
    aligned_with_name: str | None = None


class ArticleProteinEditBody(CamelModel):
    """Data model for editing protein components in an article."""
    component_id: int
    new_name: str | None = None
    new_aligned_with_name: str | None = None


class ArticleImageUploadBody(CamelModel):
    """Data model for uploading image components to an article."""
    article_id: int
    src: str
    width: int | None = None
    height: int | None = None


class ArticleImageEditBody(CamelModel):
    """Data model for editing image components in an article."""
    component_id: int
    new_src: str | None = None
    new_height: int | None = None
    new_width: int | None = None


class InsertComponent(CamelModel):
    """Data model for inserting a component into an article."""
    article_id: int
    component_id: int
    component_type: ComponentType = ComponentType.TEXT


class InsertBlankComponentEnd(CamelModel):
    """Data model for inserting a blank component at the end of an article."""
    article_id: int
    component_type: ComponentType = ComponentType.TEXT


class MoveDirection(enum.Enum):
    """Enum for the direction of component movement in an article."""
    UP = "up"
    DOWN = "down"


class MoveComponent(CamelModel):
    """Data model for moving a component within an article."""
    article_id: int
    component_id: int
    direction: MoveDirection
