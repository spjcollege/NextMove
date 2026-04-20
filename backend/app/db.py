from sqlalchemy import (
    create_engine, Column, Integer, String, Float, Text,
    ForeignKey, DateTime, Boolean, Table
)
from sqlalchemy.orm import DeclarativeBase, sessionmaker, relationship
from datetime import datetime

SQLALCHEMY_DATABASE_URL = "sqlite:///./nextmove.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


# ─── Dependency ───
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ═══════════════════════════════════════════
#  USER & AUTH
# ═══════════════════════════════════════════

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, default="")
    avatar_url = Column(String, default="")
    bio = Column(Text, default="")
    phone = Column(String, default="")
    address = Column(Text, default="")
    rating = Column(Integer, default=1200)  # chess rating
    puzzle_rating = Column(Integer, default=800)
    is_admin = Column(Boolean, default=False)
    subscription_tier = Column(String, default="free")  # free / premium / pro
    loyalty_points = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    # relationships
    orders = relationship("Order", back_populates="user")
    reviews = relationship("Review", back_populates="user")
    wishlist_items = relationship("WishlistItem", back_populates="user")
    enrollments = relationship("Enrollment", back_populates="user")
    forum_posts = relationship("ForumPost", back_populates="user")
    forum_comments = relationship("ForumComment", back_populates="user")


# ═══════════════════════════════════════════
#  E-COMMERCE: PRODUCTS
# ═══════════════════════════════════════════

class Product(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text, default="")
    price = Column(Float, nullable=False)
    original_price = Column(Float, default=0)  # for showing discount
    stock = Column(Integer, default=0)
    category = Column(String, default="general")  # boards, pieces, clocks, books, sets, accessories
    image_url = Column(String, default="")
    images = Column(Text, default="[]")  # JSON array of image URLs
    rating_avg = Column(Float, default=0.0)
    rating_count = Column(Integer, default=0)
    is_featured = Column(Boolean, default=False)
    loyalty_points = Column(Integer, default=0)  # Points earned on purchase (or cost if negative)
    created_at = Column(DateTime, default=datetime.utcnow)

    reviews = relationship("Review", back_populates="product")
    order_items = relationship("OrderItem", back_populates="product")


class Review(Base):
    __tablename__ = "reviews"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    product_id = Column(Integer, ForeignKey("products.id"))
    rating = Column(Integer, nullable=False)  # 1-5
    title = Column(String, default="")
    text = Column(Text, default="")
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="reviews")
    product = relationship("Product", back_populates="reviews")


class WishlistItem(Base):
    __tablename__ = "wishlist_items"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    product_id = Column(Integer, ForeignKey("products.id"))
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="wishlist_items")
    product = relationship("Product")


# ═══════════════════════════════════════════
#  ORDERS
# ═══════════════════════════════════════════

class Order(Base):
    __tablename__ = "orders"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    status = Column(String, default="placed")  # placed → confirmed → shipped → out_for_delivery → delivered
    total = Column(Float, default=0)
    address = Column(Text, default="")
    payment_method = Column(String, default="cod")
    tracking_number = Column(String, default="")   # e.g. NXT-20260420-0001
    estimated_delivery = Column(DateTime, nullable=True)
    status_updated_at = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="orders")
    items = relationship("OrderItem", back_populates="order")


class OrderItem(Base):
    __tablename__ = "order_items"
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"))
    product_id = Column(Integer, ForeignKey("products.id"))
    quantity = Column(Integer, default=1)
    price = Column(Float, default=0)  # price at time of purchase

    order = relationship("Order", back_populates="items")
    product = relationship("Product", back_populates="order_items")


# ═══════════════════════════════════════════
#  COURSES & LEARNING
# ═══════════════════════════════════════════

class Course(Base):
    __tablename__ = "courses"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, default="")
    instructor = Column(String, default="NextMove Team")
    price = Column(Float, default=0)
    duration = Column(String, default="")
    difficulty = Column(String, default="beginner")  # beginner / intermediate / advanced
    category = Column(String, default="general")  # openings, middlegame, endgame, tactics, strategy
    thumbnail = Column(String, default="")
    is_free = Column(Boolean, default=False)
    lesson_count = Column(Integer, default=0)
    enrolled_count = Column(Integer, default=0)
    rating_avg = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)

    lessons = relationship("Lesson", back_populates="course", order_by="Lesson.order")
    enrollments = relationship("Enrollment", back_populates="course")


class Lesson(Base):
    __tablename__ = "lessons"
    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"))
    title = Column(String, nullable=False)
    content = Column(Text, default="")  # markdown content
    video_url = Column(String, default="")
    fen_position = Column(String, default="")  # chess position for interactive board
    order = Column(Integer, default=0)
    duration_minutes = Column(Integer, default=10)

    course = relationship("Course", back_populates="lessons")


class Enrollment(Base):
    __tablename__ = "enrollments"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    course_id = Column(Integer, ForeignKey("courses.id"))
    progress = Column(Float, default=0.0)  # 0-100 percentage
    completed_lessons = Column(Text, default="[]")  # JSON array of lesson IDs
    enrolled_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="enrollments")
    course = relationship("Course", back_populates="enrollments")


# ═══════════════════════════════════════════
#  PUZZLES
# ═══════════════════════════════════════════

class Puzzle(Base):
    __tablename__ = "puzzles"
    id = Column(Integer, primary_key=True, index=True)
    fen = Column(String, nullable=False)  # chess position
    solution = Column(String, nullable=False)  # comma-separated moves e.g. "e2e4,d7d5"
    difficulty = Column(Integer, default=1200)
    theme = Column(String, default="tactics")  # fork, pin, skewer, mate-in-2, etc.
    is_daily = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class PuzzleAttempt(Base):
    __tablename__ = "puzzle_attempts"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    puzzle_id = Column(Integer, ForeignKey("puzzles.id"))
    solved = Column(Boolean, default=False)
    attempted_at = Column(DateTime, default=datetime.utcnow)


# ═══════════════════════════════════════════
#  COMMUNITY & FORUMS
# ═══════════════════════════════════════════

class ForumPost(Base):
    __tablename__ = "forum_posts"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String, nullable=False)
    content = Column(Text, default="")
    category = Column(String, default="general")  # general, openings, endgame, tournament, analysis
    likes = Column(Integer, default=0)
    views = Column(Integer, default=0)
    is_pinned = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="forum_posts")
    comments = relationship("ForumComment", back_populates="post")


class ForumComment(Base):
    __tablename__ = "forum_comments"
    id = Column(Integer, primary_key=True, index=True)
    post_id = Column(Integer, ForeignKey("forum_posts.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    content = Column(Text, nullable=False)
    likes = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    post = relationship("ForumPost", back_populates="comments")
    user = relationship("User", back_populates="forum_comments")


class CommunityMessage(Base):
    __tablename__ = "community_messages"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    text = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


# ═══════════════════════════════════════════
#  NEWS & BLOG
# ═══════════════════════════════════════════

class NewsArticle(Base):
    __tablename__ = "news_articles"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    content = Column(Text, default="")
    summary = Column(Text, default="")
    image_url = Column(String, default="")
    author = Column(String, default="NextMove Team")
    category = Column(String, default="news")  # news, tutorial, tournament, update
    created_at = Column(DateTime, default=datetime.utcnow)


# ═══════════════════════════════════════════
#  COMPETITIONS
# ═══════════════════════════════════════════

class Competition(Base):
    __tablename__ = "competitions"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, default="")
    prize_pool = Column(String, default="")
    entry_fee = Column(Float, default=0)
    points_reward = Column(Integer, default=50) # Points for winning
    start_date = Column(DateTime, default=datetime.utcnow)
    end_date = Column(DateTime, default=datetime.utcnow)
    status = Column(String, default="upcoming")  # upcoming, active, completed
    max_participants = Column(Integer, default=100)
    image_url = Column(String, default="")

    participants = relationship("CompetitionParticipation", back_populates="competition")


class CompetitionParticipation(Base):
    __tablename__ = "competition_participations"
    id = Column(Integer, primary_key=True, index=True)
    competition_id = Column(Integer, ForeignKey("competitions.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    joined_at = Column(DateTime, default=datetime.utcnow)
    is_winner = Column(Boolean, default=False)

    competition = relationship("Competition", back_populates="participants")
    user = relationship("User")


# ═══════════════════════════════════════════
#  CRM: USER ACTIVITY TRACKING
# ═══════════════════════════════════════════

class UserActivity(Base):
    __tablename__ = "user_activity"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    action = Column(String, nullable=False)  # view, purchase, search, wishlist
    product_id = Column(Integer, nullable=True)
    extra_data = Column(Text, default="")  # JSON extra data
    created_at = Column(DateTime, default=datetime.utcnow)


# ─── Create all tables ───
Base.metadata.create_all(bind=engine)
