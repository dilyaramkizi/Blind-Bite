from app import app, db, Menu, Allergy, menu_allergy

def seed_database():
    with app.app_context():
        # Clear existing data in correct order
        db.session.query(menu_allergy).delete()  # Clear junction table first
        db.session.query(Menu).delete()          # Then delete dishes
        db.session.query(Allergy).delete()       # Then delete allergies
        db.session.commit()

        # Create all allergies
        allergies = {
            "dairy": Allergy(name="dairy"),
            "peanuts": Allergy(name="peanuts"),
            "shellfish": Allergy(name="shellfish"),
            "soy": Allergy(name="soy"),
            "eggs": Allergy(name="eggs"),
            "wheat": Allergy(name="wheat"),
            "nuts": Allergy(name="nuts")
        }
        db.session.add_all(allergies.values())
        db.session.commit()

        # Create sample dishes with allergy associations
        dishes = [
            Menu(
                name="Tacos",
                description="Mexican tortillas filled with seasoned meat, cheese, and salsa.",
                cuisine="Mexican",
                spice_level="hot",
                calories=700,
                price=10.0,
                vegetarian=False,
                gluten_free=True,
                ingredients=["Tortilla", "Beef", "Cheese", "Salsa"],
                allergies=[allergies["dairy"], allergies["wheat"]],
                image_path="images/Tacos.webp",
            ),
            Menu(
                name="Sushi",
                description="Fresh sushi rolls with rice, seaweed, and fish.",
                cuisine="Japanese",
                spice_level="medium",
                calories=500,
                price=15.0,
                vegetarian=True,
                gluten_free=True,
                ingredients=["Rice", "Seaweed", "Fish"],
                allergies=[],
                image_path="images/sushi.webp",
            ),
            Menu(
                name="Croissants",
                description="Flaky French pastry with buttery layers.",
                cuisine="French",
                spice_level="mild",
                calories=350,
                price=5.0,
                vegetarian=True,
                gluten_free=False,
                ingredients=["Butter", "Flour", "Yeast"],
                allergies=[allergies["dairy"], allergies["wheat"]],
                image_path="images/croissants.jpg"
            ),
            Menu(
                name="Cheeseburger",
                description="A juicy beef patty with cheese, lettuce, and tomato.",
                cuisine="American",
                spice_level="mild",
                calories=900,
                price=8.0,
                vegetarian=False,
                gluten_free=False,
                ingredients=["Beef", "Cheese", "Lettuce", "Tomato", "Bun"],
                allergies=[allergies["dairy"], allergies["wheat"]],
                image_path="images/cheeseburger.png"
            ),
            Menu(
                name="Pad Thai",
                description="Stir-fried rice noodles with shrimp, tofu, and peanuts.",
                cuisine="Thai",
                spice_level="hot",
                calories=700,
                price=12.0,
                vegetarian=True,
                gluten_free=True,
                ingredients=["Rice Noodles", "Shrimp", "Tofu", "Peanuts", "Soy Sauce"],
                allergies=[allergies["shellfish"], allergies["peanuts"], allergies["soy"], allergies["nuts"]],
                image_path="images/pad-thai.webp"
            ),
            Menu(
                name="Bulgogi",
                description="Korean grilled beef marinated with soy sauce, sesame oil, and garlic.",
                cuisine="Korean",
                spice_level="medium",
                calories=600,
                price=14.0,
                vegetarian=False,
                gluten_free=False,
                ingredients=["Beef", "Soy Sauce", "Sesame Oil", "Garlic"],
                allergies=[allergies["soy"]],
                image_path="images/bulgogi.jpg"
            ),
            Menu(
                name="Chicken Shawarma",
                description="Middle Eastern spiced chicken wrapped in pita with garlic sauce.",
                cuisine="Middle Eastern",
                spice_level="medium",
                calories=800,
                price=10.0,
                vegetarian=False,
                gluten_free=True,
                ingredients=["Chicken", "Pita", "Garlic Sauce", "Spices"],
                allergies=[allergies["wheat"]],
                image_path="images/chicken-shwarma.avif"
            ),
            Menu(
                name="Falafel",
                description="Fried chickpea balls served in pita with tahini sauce.",
                cuisine="Middle Eastern",
                spice_level="medium",
                calories=500,
                price=7.0,
                vegetarian=True,
                gluten_free=True,
                ingredients=["Chickpeas", "Tahini", "Pita"],
                allergies=[allergies["wheat"]],
                image_path="images/Felafel.jpg"
            ),
            Menu(
                name="Borscht",
                description="Traditional Russian beet soup with sour cream.",
                cuisine="Russian",
                spice_level="mild",
                calories=400,
                price=6.0,
                vegetarian=True,
                gluten_free=True,
                ingredients=["Beets", "Sour Cream", "Garlic"],
                allergies=[allergies["dairy"]],
                image_path="images/borscht-soup.jpg"
            ),
            Menu(
                name="Moussaka",
                description="Greek layered casserole with eggplant, minced meat, and béchamel sauce.",
                cuisine="Greek",
                spice_level="medium",
                calories=600,
                price=13.0,
                vegetarian=False,
                gluten_free=False,
                ingredients=["Eggplant", "Ground Beef", "Béchamel Sauce"],
                allergies=[allergies["dairy"]],
                image_path="images/Greek-Moussaka.webp"
            ),
            Menu(
                name="Ramen",
                description="Japanese noodle soup with a rich broth, pork, and boiled egg.",
                cuisine="Japanese",
                spice_level="medium",
                calories=700,
                price=10.0,
                vegetarian=False,
                gluten_free=False,
                ingredients=["Ramen Noodles", "Pork", "Egg", "Broth"],
                allergies=[allergies["wheat"], allergies["eggs"]],
                image_path="images/ramen.jpeg"
            ),
            Menu(
                name="Lamb Kebab",
                description="Skewered lamb marinated in Middle Eastern spices, grilled to perfection.",
                cuisine="Middle Eastern",
                spice_level="hot",
                calories=750,
                price=12.0,
                vegetarian=False,
                gluten_free=True,
                ingredients=["Lamb", "Spices", "Garlic"],
                allergies=[],
                image_path="images/lamb-kebab.jpg"
            ),
            Menu(
                name="Clam Chowder",
                description="Creamy soup with tender clams, potatoes, and celery.",
                cuisine="American",
                spice_level="mild",
                calories=500,
                price=9.0,
                vegetarian=False,
                gluten_free=False,
                ingredients=["Clams", "Potatoes", "Celery", "Cream"],
                allergies=[allergies["shellfish"], allergies["dairy"]],
                image_path="images/clam-chowder.jpg"
            ),
            Menu(
                name="Peking Duck",
                description="Crispy duck served with pancakes, hoisin sauce, and vegetables.",
                cuisine="Chinese",
                spice_level="mild",
                calories=950,
                price=20.0,
                vegetarian=False,
                gluten_free=False,
                ingredients=["Duck", "Pancakes", "Hoisin Sauce"],
                allergies=[allergies["wheat"], allergies["soy"]],
                image_path="images/peking-duck.jpg"
            ),
            Menu(
                name="Vegetable Stir-fry",
                description="A medley of vegetables stir-fried in soy sauce and sesame oil.",
                cuisine="Chinese",
                spice_level="mild",
                calories=300,
                price=8.0,
                vegetarian=True,
                gluten_free=True,
                ingredients=["Vegetables", "Soy Sauce", "Sesame Oil"],
                allergies=[allergies["soy"]],
                image_path="images/veg-stir-fry.jpeg"
            ),
            Menu(
                name="Caesar Salad",
                description="Crisp romaine lettuce, croutons, and Caesar dressing.",
                cuisine="American",
                spice_level="mild",
                calories=350,
                price=7.0,
                vegetarian=True,
                gluten_free=False,
                ingredients=["Lettuce", "Croutons", "Caesar Dressing"],
                allergies=[allergies["wheat"], allergies["dairy"], allergies["eggs"]],
                image_path="images/caesar-salad.jpg"
            ),
            Menu(
                name="Tom Yum Soup",
                description="Spicy Thai soup with shrimp, mushrooms, and lemongrass.",
                cuisine="Thai",
                spice_level="hot",
                calories=200,
                price=6.0,
                vegetarian=False,
                gluten_free=True,
                ingredients=["Shrimp", "Mushrooms", "Lemongrass"],
                allergies=[allergies["shellfish"]],
                image_path="images/tom-yum.jpg"
            ),
            Menu(
                name="Fried Rice",
                description="Stir-fried rice with vegetables, eggs, and soy sauce.",
                cuisine="Chinese",
                spice_level="mild",
                calories=400,
                price=5.0,
                vegetarian=True,
                gluten_free=False,
                ingredients=["Rice", "Eggs", "Soy Sauce", "Vegetables"],
                allergies=[allergies["eggs"], allergies["soy"]],
                image_path="images/Fried-Rice.webp"
            ),
            Menu(
                name="Pizza Margherita",
                description="Classic pizza topped with fresh mozzarella, tomatoes, and basil.",
                cuisine="Italian",
                spice_level="mild",
                calories=700,
                price=12.0,
                vegetarian=True,
                gluten_free=False,
                ingredients=["Mozzarella", "Tomatoes", "Basil", "Dough"],
                allergies=[allergies["dairy"], allergies["wheat"]],
                image_path="images/pizza-margherita.webp"
            )
        ]

        db.session.add_all(dishes)
        db.session.commit()
        print(f"Seeded {len(dishes)} dishes and {len(allergies)} allergies")

if __name__ == "__main__":
    seed_database()