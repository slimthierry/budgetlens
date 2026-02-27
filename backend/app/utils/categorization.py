"""Transaction categorization utilities."""

# Default expense categories with icons and colors
DEFAULT_EXPENSE_CATEGORIES = [
    {"name": "Alimentation", "icon": "shopping-cart", "color": "#10B981", "type": "expense"},
    {"name": "Transport", "icon": "car", "color": "#3B82F6", "type": "expense"},
    {"name": "Logement", "icon": "home", "color": "#8B5CF6", "type": "expense"},
    {"name": "Loisirs", "icon": "gamepad", "color": "#F59E0B", "type": "expense"},
    {"name": "Santé", "icon": "heart", "color": "#EF4444", "type": "expense"},
    {"name": "Shopping", "icon": "shopping-bag", "color": "#EC4899", "type": "expense"},
    {"name": "Éducation", "icon": "book", "color": "#06B6D4", "type": "expense"},
    {"name": "Abonnements", "icon": "repeat", "color": "#6366F1", "type": "expense"},
    {"name": "Restaurants", "icon": "utensils", "color": "#F97316", "type": "expense"},
    {"name": "Factures", "icon": "file-text", "color": "#78716C", "type": "expense"},
    {"name": "Assurance", "icon": "shield", "color": "#0EA5E9", "type": "expense"},
    {"name": "Autres dépenses", "icon": "more-horizontal", "color": "#6B7280", "type": "expense"},
]

# Default income categories
DEFAULT_INCOME_CATEGORIES = [
    {"name": "Salaire", "icon": "briefcase", "color": "#22C55E", "type": "income"},
    {"name": "Freelance", "icon": "laptop", "color": "#A855F7", "type": "income"},
    {"name": "Investissements", "icon": "trending-up", "color": "#14B8A6", "type": "income"},
    {"name": "Cadeaux", "icon": "gift", "color": "#F472B6", "type": "income"},
    {"name": "Remboursements", "icon": "rotate-ccw", "color": "#60A5FA", "type": "income"},
    {"name": "Autres revenus", "icon": "plus-circle", "color": "#6B7280", "type": "income"},
]

# Keyword-based auto-categorization rules
CATEGORIZATION_KEYWORDS = {
    "Alimentation": [
        "supermarché", "carrefour", "lidl", "aldi", "monoprix", "intermarché",
        "leclerc", "auchan", "courses", "épicerie", "boulangerie",
    ],
    "Transport": [
        "essence", "carburant", "parking", "péage", "uber", "taxi",
        "sncf", "ratp", "navigo", "train", "métro", "bus",
    ],
    "Restaurants": [
        "restaurant", "mcdonalds", "burger", "pizza", "sushi",
        "deliveroo", "uber eats", "just eat",
    ],
    "Abonnements": [
        "netflix", "spotify", "amazon prime", "disney+", "canal+",
        "internet", "mobile", "téléphone", "forfait",
    ],
    "Logement": [
        "loyer", "charges", "edf", "engie", "eau", "électricité",
        "gaz", "syndic", "copropriété",
    ],
    "Santé": [
        "pharmacie", "médecin", "dentiste", "mutuelle", "cpam",
        "opticien", "hôpital",
    ],
    "Shopping": [
        "amazon", "fnac", "zara", "h&m", "decathlon",
        "ikea", "vêtements", "chaussures",
    ],
}


def suggest_category(description: str) -> str | None:
    """Suggest a category based on transaction description keywords."""
    if not description:
        return None

    description_lower = description.lower()

    for category, keywords in CATEGORIZATION_KEYWORDS.items():
        for keyword in keywords:
            if keyword in description_lower:
                return category

    return None
