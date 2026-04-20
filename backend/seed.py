"""
Seed the NextMove database with sample data.
Run: python seed.py
"""
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from app.db import SessionLocal, Base, engine
from app.db import (
    Product, Course, Lesson, Puzzle, NewsArticle, ForumPost, User
)
from app.auth_utils import hash_password

# Reset DB
Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)

db = SessionLocal()

# ═══════════════════════════════════════════
#  USERS (demo accounts)
# ═══════════════════════════════════════════
users = [
    User(
        username="admin", email="admin@nextmove.com",
        hashed_password=hash_password("admin123"),
        full_name="NextMove Admin", is_admin=True,
        rating=2200, puzzle_rating=2000,
        subscription_tier="pro",
        loyalty_points=5000,
        bio="Platform administrator & chess enthusiast.",
    ),
    User(
        username="magnus", email="magnus@nextmove.com",
        hashed_password=hash_password("chess123"),
        full_name="Magnus C.", rating=2800, puzzle_rating=2600,
        subscription_tier="pro",
        bio="World champion level player. Love endgames.",
    ),
    User(
        username="chesslover", email="chesslover@nextmove.com",
        hashed_password=hash_password("chess123"),
        full_name="Priya Sharma", rating=1500, puzzle_rating=1400,
        subscription_tier="premium",
        bio="Learning chess one puzzle at a time!",
    ),
]
db.add_all(users)
db.commit()

# ═══════════════════════════════════════════
#  PRODUCTS (20 chess products)
# ═══════════════════════════════════════════
products = [
    # Boards
    Product(name="Wooden Tournament Chess Board", description="Professional 21-inch wooden tournament chess board with algebraic notation. Made from walnut and maple wood with a beautiful glossy finish.", price=1500, original_price=1999, stock=10, category="boards", rating_avg=4.5, rating_count=12, is_featured=True),
    Product(name="Luxury Marble Chess Board", description="Hand-carved Italian marble chess board. A stunning centerpiece that doubles as a work of art. White and green marble squares.", price=3500, original_price=4500, stock=5, category="boards", rating_avg=4.8, rating_count=8, is_featured=True),
    Product(name="Foldable Tournament Board", description="Portable foldable tournament board with built-in piece storage. Perfect for club players on the go.", price=1100, original_price=1400, stock=18, category="boards", rating_avg=4.2, rating_count=15),
    Product(name="Silicone Roll-Up Chess Board", description="Ultra-portable silicone roll-up board. Waterproof, lightweight, and durable. Great for travel.", price=450, stock=30, category="boards", rating_avg=4.0, rating_count=20),

    # Pieces
    Product(name="Weighted Staunton Chess Pieces", description="Classic triple-weighted Staunton chess pieces with felt bottoms. King height: 3.75 inches. Perfect tournament standard.", price=900, original_price=1200, stock=15, category="pieces", rating_avg=4.6, rating_count=22, is_featured=True),
    Product(name="Professional Chess Pieces Set", description="Hand-carved boxwood chess pieces with knight's mane detail. Competition grade with extra queens.", price=2000, original_price=2500, stock=12, category="pieces", rating_avg=4.7, rating_count=10),
    Product(name="Themed Medieval Chess Pieces", description="Beautifully detailed medieval-themed chess pieces. Knights on horseback, castles as rooks. Collector's edition.", price=2800, stock=7, category="pieces", rating_avg=4.9, rating_count=5, is_featured=True),

    # Clocks
    Product(name="Digital Chess Clock DGT 3000", description="Professional digital chess clock with multiple time controls including Fischer, Bronstein, and delay modes. FIDE approved.", price=1700, original_price=2100, stock=8, category="clocks", rating_avg=4.4, rating_count=18),
    Product(name="Analog Wooden Chess Clock", description="Classic analog chess clock with beautiful wooden case. Mechanical movement with precise timing.", price=2200, stock=6, category="clocks", rating_avg=4.3, rating_count=9),

    # Books
    Product(name="My System - Aron Nimzowitsch", description="The chess classic that revolutionized positional play. Essential reading for every serious chess student.", price=500, stock=25, category="books", rating_avg=4.8, rating_count=45),
    Product(name="Endgame Manual - Mark Dvoretsky", description="The definitive endgame reference. Comprehensive coverage of all endgame types with detailed analysis.", price=750, original_price=900, stock=20, category="books", rating_avg=4.9, rating_count=30),
    Product(name="Chess Opening Essentials Vol 1-4", description="Complete opening repertoire series. Covers all major openings with ideas, traps, and model games.", price=1200, original_price=1600, stock=15, category="books", rating_avg=4.5, rating_count=12),
    Product(name="Chess Notation Scorebook", description="Professional chess scorepad with 100 games. Spiral bound with algebraic notation diagrams.", price=350, stock=30, category="books", rating_avg=4.1, rating_count=8),

    # Sets
    Product(name="Magnetic Travel Chess Set", description="Compact magnetic chess set perfect for travel. Pieces stay in place during car rides and flights. Foldable board.", price=600, original_price=800, stock=20, category="sets", rating_avg=4.3, rating_count=28),
    Product(name="Complete Tournament Chess Set", description="Everything you need: weighted pieces, vinyl board, digital clock, and carrying bag. Tournament ready.", price=3200, original_price=3800, stock=8, category="sets", rating_avg=4.7, rating_count=14, is_featured=True),
    Product(name="Beginner's Chess Set with Guide", description="Perfect starter set for new players. Includes pieces with move indicators, board, and illustrated guidebook.", price=800, stock=25, category="sets", rating_avg=4.4, rating_count=35),

    # Accessories
    Product(name="Chess Piece Storage Box", description="Handcrafted wooden storage box with velvet lining. Fits all standard Staunton pieces up to 4 inches.", price=650, stock=15, category="accessories", rating_avg=4.2, rating_count=7),
    Product(name="Chess Board Carrying Bag", description="Padded carrying bag for boards up to 22 inches. Water-resistant with shoulder strap and pockets.", price=400, stock=20, category="accessories", rating_avg=4.0, rating_count=11),
    Product(name="Chess Analysis Software - Stockfish Pro", description="Premium chess analysis software with cloud engine support. Includes opening book and endgame tablebase.", price=1500, stock=999, category="accessories", rating_avg=4.6, rating_count=50, is_featured=True),
    Product(name="Chess Coaching Session (1hr)", description="One-on-one chess coaching session with a titled player. Covers openings, tactics, and game analysis.", price=999, stock=100, category="accessories", rating_avg=4.9, rating_count=20),
]
db.add_all(products)
db.commit()

# ═══════════════════════════════════════════
#  COURSES (8 courses with lessons)
# ═══════════════════════════════════════════
courses_data = [
    {
        "title": "Chess Basics for Beginners",
        "description": "Start your chess journey! Learn how each piece moves, basic rules, and your first checkmate patterns. Perfect for absolute beginners.",
        "instructor": "GM Arjun Verma",
        "price": 0, "is_free": True,
        "duration": "2 Weeks", "difficulty": "beginner",
        "category": "strategy", "lesson_count": 5,
        "thumbnail": "", "rating_avg": 4.7, "enrolled_count": 1500,
        "lessons": [
            {"title": "The Chessboard & Pieces", "content": "Learn about the 64 squares, how to set up the board correctly, and the name of each piece.", "order": 1, "duration_minutes": 15, "fen_position": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"},
            {"title": "How Pieces Move", "content": "Detailed guide on how each piece moves: pawns, knights, bishops, rooks, queens, and kings.", "order": 2, "duration_minutes": 20},
            {"title": "Check, Checkmate & Stalemate", "content": "Understanding when the king is in danger and how games end.", "order": 3, "duration_minutes": 15},
            {"title": "Special Moves", "content": "Castling, en passant, and pawn promotion explained with examples.", "order": 4, "duration_minutes": 15},
            {"title": "Your First Checkmates", "content": "Learn Scholar's Mate, Fool's Mate, and basic back-rank checkmates.", "order": 5, "duration_minutes": 20, "fen_position": "r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 4 4"},
        ],
    },
    {
        "title": "Mastering Chess Openings",
        "description": "Build a solid opening repertoire. Study the Italian Game, Sicilian Defense, Queen's Gambit, and more with grandmaster-level analysis.",
        "instructor": "IM Neha Kapoor",
        "price": 499, "is_free": False,
        "duration": "1 Month", "difficulty": "intermediate",
        "category": "openings", "lesson_count": 6,
        "rating_avg": 4.5, "enrolled_count": 820,
        "lessons": [
            {"title": "Opening Principles", "content": "Control the center, develop pieces, castle early. The three golden rules.", "order": 1, "duration_minutes": 20},
            {"title": "The Italian Game", "content": "1.e4 e5 2.Nf3 Nc6 3.Bc4 — classic attacking opening with rich tactical possibilities.", "order": 2, "duration_minutes": 25, "fen_position": "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3"},
            {"title": "The Sicilian Defense", "content": "1.e4 c5 — the most popular response to e4 at all levels.", "order": 3, "duration_minutes": 25},
            {"title": "Queen's Gambit", "content": "1.d4 d5 2.c4 — a strategic opening that leads to rich middlegame play.", "order": 4, "duration_minutes": 25},
            {"title": "The London System", "content": "A universal system for White that's easy to learn and hard to refute.", "order": 5, "duration_minutes": 20},
            {"title": "Building Your Repertoire", "content": "How to choose openings that suit your style and build a cohesive repertoire.", "order": 6, "duration_minutes": 20},
        ],
    },
    {
        "title": "Tactical Mastery",
        "description": "Sharpen your tactical vision! Master forks, pins, skewers, discovered attacks, and complex combinations.",
        "instructor": "GM Arjun Verma",
        "price": 799, "is_free": False,
        "duration": "1.5 Months", "difficulty": "intermediate",
        "category": "tactics", "lesson_count": 5,
        "rating_avg": 4.8, "enrolled_count": 1200,
        "lessons": [
            {"title": "Forks & Double Attacks", "content": "One piece attacks two targets — the most basic and devastating tactic.", "order": 1, "duration_minutes": 20},
            {"title": "Pins & Skewers", "content": "Lining up pieces for attacks along files, ranks, and diagonals.", "order": 2, "duration_minutes": 20},
            {"title": "Discovered Attacks", "content": "Moving one piece to unleash another — including the devastating discovered check.", "order": 3, "duration_minutes": 25},
            {"title": "Sacrifices & Combinations", "content": "When giving up material wins the game. Famous combinations analyzed.", "order": 4, "duration_minutes": 30},
            {"title": "Calculation Training", "content": "How to calculate 3-5 moves ahead accurately and consistently.", "order": 5, "duration_minutes": 25},
        ],
    },
    {
        "title": "Endgame Fundamentals",
        "description": "Master the endgame! From basic king and pawn endings to complex rook endgames. The difference between a draw and a win.",
        "instructor": "IM Neha Kapoor",
        "price": 699, "is_free": False,
        "duration": "1 Month", "difficulty": "intermediate",
        "category": "endgame", "lesson_count": 5,
        "rating_avg": 4.6, "enrolled_count": 650,
        "lessons": [
            {"title": "King & Pawn Endings", "content": "Opposition, key squares, and the rule of the square.", "order": 1, "duration_minutes": 20},
            {"title": "Rook Endings", "content": "Lucena position, Philidor position, and active rook principles.", "order": 2, "duration_minutes": 25},
            {"title": "Minor Piece Endings", "content": "Bishop vs knight, good bishop vs bad bishop, and fortresses.", "order": 3, "duration_minutes": 20},
            {"title": "Queen Endings", "content": "Queen vs pawn, queen vs rook, and queen endgame techniques.", "order": 4, "duration_minutes": 20},
            {"title": "Practical Endgame Thinking", "content": "How to simplify into winning endgames from the middlegame.", "order": 5, "duration_minutes": 25},
        ],
    },
    {
        "title": "Positional Chess Masterclass",
        "description": "Think like a grandmaster! Learn pawn structures, piece placement, weak squares, and long-term strategic planning.",
        "instructor": "GM Arjun Verma",
        "price": 999, "is_free": False,
        "duration": "2 Months", "difficulty": "advanced",
        "category": "strategy", "lesson_count": 5,
        "rating_avg": 4.9, "enrolled_count": 400,
        "lessons": [
            {"title": "Pawn Structures", "content": "Understanding isolated pawns, doubled pawns, pawn chains, and pawn majorities.", "order": 1, "duration_minutes": 30},
            {"title": "Piece Activity", "content": "Good vs bad pieces, outposts, piece coordination, and domination.", "order": 2, "duration_minutes": 25},
            {"title": "Weak Squares & Color Complexes", "content": "Identifying and exploiting weaknesses in your opponent's position.", "order": 3, "duration_minutes": 25},
            {"title": "Space Advantage", "content": "Using space to restrict opponent's pieces and create attacking chances.", "order": 4, "duration_minutes": 25},
            {"title": "Strategic Planning", "content": "How to form and execute long-term plans based on pawn structure.", "order": 5, "duration_minutes": 30},
        ],
    },
    {
        "title": "Advanced Tournament Preparation",
        "description": "Prepare for competitive play. Learn opponent preparation, time management, psychology, and how to handle pressure.",
        "instructor": "GM Arjun Verma",
        "price": 1499, "is_free": False,
        "duration": "3 Months", "difficulty": "advanced",
        "category": "strategy", "lesson_count": 4,
        "rating_avg": 4.7, "enrolled_count": 200,
        "lessons": [
            {"title": "Opponent Preparation", "content": "How to study your opponent's games and prepare surprises.", "order": 1, "duration_minutes": 30},
            {"title": "Time Management", "content": "Clock management strategies for classical, rapid, and blitz games.", "order": 2, "duration_minutes": 25},
            {"title": "Psychology of Chess", "content": "Handling nerves, sportsmanship, and mental resilience.", "order": 3, "duration_minutes": 25},
            {"title": "Post-Game Analysis", "content": "How to analyze your games effectively for maximum improvement.", "order": 4, "duration_minutes": 30},
        ],
    },
]

for c_data in courses_data:
    lessons_data = c_data.pop("lessons", [])
    course = Course(**c_data)
    db.add(course)
    db.commit()
    db.refresh(course)

    for l_data in lessons_data:
        lesson = Lesson(course_id=course.id, **l_data)
        db.add(lesson)
    db.commit()

# ═══════════════════════════════════════════
#  PUZZLES (10 puzzles)
# ═══════════════════════════════════════════
puzzles = [
    Puzzle(fen="r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 4 4", solution="Qxf7#", difficulty=800, theme="checkmate", is_daily=True),
    Puzzle(fen="r1bqkbnr/pppppppp/2n5/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 1 2", solution="d4", difficulty=600, theme="opening"),
    Puzzle(fen="rnbqkbnr/pppp1ppp/8/4p3/6P1/5P2/PPPPP2P/RNBQKBNR b KQkq - 0 2", solution="Qh4#", difficulty=700, theme="checkmate"),
    Puzzle(fen="r1b1kbnr/ppppqppp/2n5/4p3/2B1P3/5Q2/PPPP1PPP/RNB1K1NR w KQkq - 4 4", solution="Qxf7#", difficulty=900, theme="checkmate"),
    Puzzle(fen="8/8/8/8/8/5K2/6Q1/7k w - - 0 1", solution="Qg1", difficulty=500, theme="endgame"),
    Puzzle(fen="r1bqkbnr/ppp2ppp/2np4/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 4", solution="Ng5", difficulty=1200, theme="tactics"),
    Puzzle(fen="rnbqkb1r/pppppppp/5n2/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 1 2", solution="e5", difficulty=1000, theme="opening"),
    Puzzle(fen="r3k2r/ppp2ppp/2n1bn2/2bpp1B1/4P3/2NP1N2/PPP2PPP/R2QKB1R w KQkq - 4 6", solution="Bxf6", difficulty=1400, theme="tactics"),
    Puzzle(fen="8/5pk1/6p1/8/8/6K1/8/6R1 w - - 0 1", solution="Rf1", difficulty=1100, theme="endgame"),
    Puzzle(fen="r1bq1rk1/ppp2ppp/2n2n2/3pp3/1bP5/2NBPN2/PP3PPP/R1BQK2R w KQ - 2 7", solution="cxd5", difficulty=1300, theme="tactics"),
]
db.add_all(puzzles)
db.commit()

# ═══════════════════════════════════════════
#  NEWS ARTICLES
# ═══════════════════════════════════════════
news = [
    NewsArticle(
        title="Welcome to NextMove 2.0",
        summary="The biggest update to NextMove is here! New courses, puzzles, forums, and a complete redesign.",
        content="We're thrilled to announce NextMove 2.0 — a complete reimagining of our chess community platform.\n\n## What's New\n- **Chess Courses**: Structured learning paths from beginner to advanced\n- **Daily Puzzles**: Sharpen your tactics every day\n- **Community Forums**: Discuss openings, strategies, and more\n- **Leaderboards**: Compete with players worldwide\n- **Premium Shop**: Expanded catalog with reviews and wishlists\n\nJoin thousands of chess enthusiasts on their journey to mastery!",
        author="NextMove Team",
        category="update",
    ),
    NewsArticle(
        title="Top 5 Chess Openings for Beginners",
        summary="Start your chess journey with these proven and easy-to-learn openings.",
        content="Choosing the right opening can make or break your chess game. Here are our top 5 recommendations for beginners.\n\n### 1. Italian Game (1.e4 e5 2.Nf3 Nc6 3.Bc4)\nClassic, principled, and teaches you the fundamentals.\n\n### 2. London System (1.d4 d5 2.Bf4)\nA universal system that's easy to set up.\n\n### 3. Scotch Game (1.e4 e5 2.Nf3 Nc6 3.d4)\nImmediate central tension and open positions.\n\n### 4. French Defense (1.e4 e6)\nSolid and strategic for Black.\n\n### 5. Caro-Kann Defense (1.e4 c6)\nRock-solid with clear plans for Black.",
        author="IM Neha Kapoor",
        category="tutorial",
    ),
    NewsArticle(
        title="Chess in India: The Rise of a New Generation",
        summary="India is producing world-class chess talent at an unprecedented rate.",
        content="From Viswanathan Anand to Rameshbabu Praggnanandhaa and D. Gukesh, India has become a chess powerhouse.\n\nThe country now boasts over 80 grandmasters and a thriving chess culture that continues to grow. Youth chess programs, online platforms, and government support have all contributed to this remarkable growth.\n\nNextMove is proud to be part of this chess revolution, providing accessible learning resources and a vibrant community for Indian chess players.",
        author="NextMove Team",
        category="news",
    ),
    NewsArticle(
        title="How Solving Puzzles Improves Your Game",
        summary="Daily puzzle practice is the fastest way to improve your tactical vision.",
        content="Studies show that consistent puzzle solving is the single most effective way to improve your chess rating.\n\n## Why Puzzles Work\n- **Pattern Recognition**: You start seeing tactical motifs automatically\n- **Calculation**: You learn to think ahead accurately\n- **Time Pressure**: Quick puzzles prepare you for blitz\n\n## Recommended Practice\n- Solve 5-10 puzzles daily\n- Review mistakes carefully\n- Gradually increase difficulty\n\nTry our Daily Puzzle feature on NextMove to start improving today!",
        author="GM Arjun Verma",
        category="tutorial",
    ),
]
db.add_all(news)
db.commit()

# ═══════════════════════════════════════════
#  SAMPLE FORUM POSTS
# ═══════════════════════════════════════════
admin_user = db.query(User).filter(User.username == "admin").first()
magnus_user = db.query(User).filter(User.username == "magnus").first()

forum_posts = [
    ForumPost(user_id=admin_user.id, title="Welcome to the NextMove Community!", content="Welcome everyone! This is the official NextMove community forum. Feel free to discuss chess, share your games, ask questions, and connect with fellow players.\n\nPlease be respectful and follow our community guidelines.", category="general", is_pinned=True, likes=25, views=500),
    ForumPost(user_id=magnus_user.id, title="Best response to 1.d4?", content="I've been playing the King's Indian Defense for years but I'm looking for something more dynamic. What do you all recommend against 1.d4?\n\nI've considered the Grünfeld and the Nimzo-Indian. Would love to hear your experiences!", category="openings", likes=12, views=180),
    ForumPost(user_id=admin_user.id, title="Share Your Best Game!", content="Post your most memorable chess game here! Whether it's a brilliant sacrifice, a come-from-behind win, or just a game you're proud of — we want to see it!", category="general", likes=8, views=120),
]
db.add_all(forum_posts)
db.commit()

# ═══════════════════════════════════════════
#  COMPETITIONS (dummy)
# ═══════════════════════════════════════════
from app.db import Competition
competitions = [
    Competition(title="NextMove Summer Open", description="Our annual summer tournament for all skill levels.", prize_pool="5000", points_reward=100, status="active"),
    Competition(title="Blitz Championship 2026", description="Fast-paced blitz tournament. 3+2 time control.", prize_pool="2000", points_reward=200, status="active"),
    Competition(title="Beginner's Cup", description="Exclusive for players rated below 1200.", prize_pool="1000", points_reward=50, status="upcoming"),
]
db.add_all(competitions)
db.commit()

# ═══════════════════════════════════════════
#  LIMITED EDITION PRODUCT
# ═══════════════════════════════════════════
limited_board = Product(
    name="Legendary Grandmaster Chess Board",
    description="EXCLUSIVE: Hand-crafted from 1000-year old oak. Only accessible to our top loyalists with 100,000 points.",
    price=0,
    original_price=99999,
    stock=1,
    category="boards",
    is_featured=True,
    image_url="https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&q=80&w=800"
)
db.add(limited_board)
db.commit()

db.close()
print("✅ Database seeded successfully!")
print(f"   → {len(users)} users")
print(f"   → {len(products)} products")
print(f"   → {len(courses_data)} courses with lessons")
print(f"   → {len(puzzles)} puzzles")
print(f"   → {len(news)} news articles")
print(f"   → {len(forum_posts)} forum posts")
