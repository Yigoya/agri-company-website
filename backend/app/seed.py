"""Seed script to populate database with initial data."""
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import SessionLocal, engine
from app.models import *
from app.database import Base
from app.core.security import get_password_hash
from app.config import settings
from datetime import datetime, timezone


def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # Check if admin exists
        existing_admin = db.query(User).filter(User.email == settings.ADMIN_EMAIL).first()
        if not existing_admin:
            admin = User(
                email=settings.ADMIN_EMAIL,
                hashed_password=get_password_hash(settings.ADMIN_PASSWORD),
                full_name="Admin User",
                is_superuser=True,
                is_active=True,
            )
            db.add(admin)
            db.commit()
            print("Admin user created.")
        else:
            print("Admin user already exists.")

        # Seed categories
        categories_data = [
            {"name": "Grains & Cereals", "slug": "grains-cereals", "description": "Premium quality grains and cereals grown with sustainable farming practices."},
            {"name": "Fresh Vegetables", "slug": "fresh-vegetables", "description": "Farm-fresh vegetables harvested at peak ripeness for maximum nutrition."},
            {"name": "Fruits", "slug": "fruits", "description": "Naturally grown fruits bursting with flavor and nutrients."},
            {"name": "Pulses & Legumes", "slug": "pulses-legumes", "description": "High-protein pulses and legumes from certified organic farms."},
            {"name": "Spices & Herbs", "slug": "spices-herbs", "description": "Aromatic spices and herbs sourced from the finest growing regions."},
            {"name": "Oils & Seeds", "slug": "oils-seeds", "description": "Cold-pressed oils and nutrient-rich seeds for healthy living."},
        ]

        for cat_data in categories_data:
            existing = db.query(ProductCategory).filter(ProductCategory.slug == cat_data["slug"]).first()
            if not existing:
                db.add(ProductCategory(**cat_data))
        db.commit()
        print("Categories seeded.")

        # Seed products
        categories = {c.slug: c.id for c in db.query(ProductCategory).all()}
        products_data = [
            {
                "name": "Premium Basmati Rice",
                "slug": "premium-basmati-rice",
                "short_description": "Long-grain aromatic basmati rice cultivated in fertile river plains.",
                "description": "Our Premium Basmati Rice is cultivated in the fertile Gangetic plains, known for producing the world's finest aromatic rice. Each grain is naturally aged for 12 months to develop its signature aroma, length, and fluffy texture when cooked. This rice is perfect for biryanis, pilafs, and everyday meals.\n\nGrown using sustainable farming methods, our basmati rice is free from pesticides and artificial additives. Every batch is rigorously tested for quality, ensuring you receive only the finest grains at your table.",
                "price": 24.99,
                "unit": "per 10kg bag",
                "origin": "Punjab, India",
                "harvest_season": "October - December",
                "packaging_info": "Available in 1kg, 5kg, 10kg, and 25kg bags. Vacuum-sealed for freshness.",
                "specifications": "Grain Length: 8.4mm+\nMoisture: <12%\nBroken Grains: <1%\nForeign Matter: Nil\nAging: 12 months minimum",
                "is_featured": True,
                "category_id": categories.get("grains-cereals"),
            },
            {
                "name": "Organic Wheat Flour",
                "slug": "organic-wheat-flour",
                "short_description": "Stone-ground organic wheat flour from heritage wheat varieties.",
                "description": "Our Organic Wheat Flour is stone-ground from heritage wheat varieties that have been carefully selected for their nutritional profile and baking qualities. The slow grinding process preserves the natural vitamins, minerals, and fiber content of the wheat berries.\n\nIdeal for making bread, chapati, cookies, and pastries. Our wheat is certified organic and sourced exclusively from farms practicing regenerative agriculture.",
                "price": 12.99,
                "unit": "per 5kg bag",
                "origin": "Madhya Pradesh, India",
                "harvest_season": "March - April",
                "packaging_info": "Available in 1kg, 5kg, and 10kg bags.",
                "specifications": "Protein: 11-13%\nMoisture: <13%\nGluten: Strong\nAsh Content: <1.5%\nCertification: USDA Organic",
                "is_featured": True,
                "category_id": categories.get("grains-cereals"),
            },
            {
                "name": "Fresh Organic Tomatoes",
                "slug": "fresh-organic-tomatoes",
                "short_description": "Vine-ripened organic tomatoes packed with flavor and nutrition.",
                "description": "Our Fresh Organic Tomatoes are vine-ripened to perfection in our greenhouse facilities. Each tomato is hand-picked at peak ripeness to ensure maximum flavor, color, and nutritional content. Rich in lycopene, vitamins A and C, these tomatoes are a powerhouse of antioxidants.\n\nPerfect for salads, sauces, soups, and everyday cooking. Our growing methods use integrated pest management and organic fertilizers to deliver the cleanest produce possible.",
                "price": 4.99,
                "unit": "per kg",
                "origin": "GreenFields Farm",
                "harvest_season": "Year-round (greenhouse)",
                "packaging_info": "Available in 1kg boxes and 5kg crates.",
                "specifications": "Variety: Heritage & Roma\nGrade: A\nSize: Medium-Large\nShelf Life: 7-10 days\nCertification: Organic",
                "is_featured": True,
                "category_id": categories.get("fresh-vegetables"),
            },
            {
                "name": "Golden Saffron Threads",
                "slug": "golden-saffron-threads",
                "short_description": "Hand-harvested premium saffron threads with intense aroma and color.",
                "description": "Our Golden Saffron Threads are hand-harvested from Crocus sativus flowers during the brief autumn bloom season. Each thread is carefully separated and dried to preserve its deep crimson color, intense aroma, and distinctive flavor.\n\nThis is Grade I saffron with the highest crocin content, making it ideal for culinary applications, traditional medicine, and cosmetics. A small pinch transforms any dish with its beautiful golden hue and complex flavor profile.",
                "price": 89.99,
                "unit": "per 10g",
                "origin": "Kashmir, India",
                "harvest_season": "October - November",
                "packaging_info": "Available in 1g, 5g, and 10g glass jars. Sealed for freshness.",
                "specifications": "Grade: I (ISO 3632)\nCrocin: >220\nSafranal: 20-50\nPicrocrocin: >70\nMoisture: <10%",
                "is_featured": True,
                "category_id": categories.get("spices-herbs"),
            },
            {
                "name": "Organic Red Lentils",
                "slug": "organic-red-lentils",
                "short_description": "Split red lentils, a quick-cooking protein-rich staple.",
                "description": "Our Organic Red Lentils are a kitchen essential, prized for their quick cooking time and smooth, creamy texture. These split lentils cook in just 15-20 minutes without pre-soaking, making them perfect for weeknight meals.\n\nPacked with plant-based protein, fiber, and essential minerals including iron and folate. Sourced from certified organic farms practicing sustainable dryland agriculture.",
                "price": 8.99,
                "unit": "per 2kg bag",
                "origin": "Rajasthan, India",
                "harvest_season": "February - March",
                "packaging_info": "Available in 500g, 1kg, 2kg, and 5kg bags.",
                "specifications": "Protein: 24-26%\nMoisture: <12%\nForeign Matter: <0.5%\nSplit: >95%\nCertification: USDA Organic",
                "is_featured": False,
                "category_id": categories.get("pulses-legumes"),
            },
            {
                "name": "Cold-Pressed Coconut Oil",
                "slug": "cold-pressed-coconut-oil",
                "short_description": "Virgin cold-pressed coconut oil, pure and unrefined.",
                "description": "Our Cold-Pressed Coconut Oil is extracted from fresh, mature coconuts using traditional cold-press methods that preserve the natural nutrients, aroma, and flavor of the coconut. This virgin, unrefined oil retains its medium-chain fatty acids, lauric acid, and natural antioxidants.\n\nVersatile for cooking, baking, skin care, and hair care. Its high smoke point makes it ideal for frying and sautéing, while its subtle coconut flavor enhances both sweet and savory dishes.",
                "price": 15.99,
                "unit": "per 1L bottle",
                "origin": "Kerala, India",
                "harvest_season": "Year-round",
                "packaging_info": "Available in 500ml, 1L, and 5L bottles.",
                "specifications": "Type: Virgin, Unrefined\nExtraction: Cold-Pressed\nLauric Acid: >48%\nFFA: <0.5%\nMoisture: <0.1%",
                "is_featured": True,
                "category_id": categories.get("oils-seeds"),
            },
            {
                "name": "Alphonso Mangoes",
                "slug": "alphonso-mangoes",
                "short_description": "Premium Alphonso mangoes, the king of fruits.",
                "description": "Our Alphonso Mangoes are sourced from the renowned orchards of Ratnagiri, where the unique terroir produces mangoes with unparalleled sweetness, richness, and aroma. Each mango is naturally ripened and hand-selected for optimal quality.\n\nKnown as the 'King of Mangoes,' Alphonso variety is prized worldwide for its creamy, non-fibrous flesh and intense tropical flavor. Perfect for eating fresh, making desserts, smoothies, and preserves.",
                "price": 34.99,
                "unit": "per dozen",
                "origin": "Ratnagiri, Maharashtra",
                "harvest_season": "April - June",
                "packaging_info": "Available in boxes of 6, 12, and 24. Carefully packed to prevent bruising.",
                "specifications": "Variety: Alphonso (Hapus)\nGrade: Premium\nWeight: 200-300g each\nBrix: >16°\nRipening: Natural, carbide-free",
                "is_featured": False,
                "category_id": categories.get("fruits"),
            },
            {
                "name": "Organic Turmeric Powder",
                "slug": "organic-turmeric-powder",
                "short_description": "High-curcumin organic turmeric powder, stone-ground.",
                "description": "Our Organic Turmeric Powder is made from high-curcumin turmeric rhizomes, carefully dried and stone-ground to a fine powder. The traditional processing preserves the vibrant golden color and potent health benefits of this ancient superfood.\n\nWith curcumin content exceeding 5%, our turmeric is significantly more potent than standard varieties. Essential for cooking, golden milk lattes, and wellness supplements.",
                "price": 11.99,
                "unit": "per 500g",
                "origin": "Erode, Tamil Nadu",
                "harvest_season": "January - March",
                "packaging_info": "Available in 100g, 250g, 500g, and 1kg packs.",
                "specifications": "Curcumin: >5%\nMoisture: <10%\nAsh: <8%\nGrind: 60-80 mesh\nCertification: USDA Organic",
                "is_featured": False,
                "category_id": categories.get("spices-herbs"),
            },
        ]

        for prod_data in products_data:
            existing = db.query(Product).filter(Product.slug == prod_data["slug"]).first()
            if not existing:
                db.add(Product(**prod_data))
        db.commit()
        print("Products seeded.")

        # Seed blog posts
        blog_posts_data = [
            {
                "title": "The Future of Sustainable Agriculture",
                "slug": "future-sustainable-agriculture",
                "excerpt": "Exploring how regenerative farming practices are reshaping the agricultural landscape for a more sustainable future.",
                "content": "# The Future of Sustainable Agriculture\n\nAgriculture stands at a crossroads. With a growing global population and increasing environmental pressures, the way we produce food must evolve. At GreenFields Agriculture, we believe that sustainable farming is not just a trend—it's the only path forward.\n\n## Regenerative Practices\n\nRegenerative agriculture goes beyond sustainability. While sustainable practices aim to maintain the current state of our resources, regenerative farming actively improves soil health, biodiversity, and ecosystem services.\n\nKey regenerative practices we employ include:\n\n- **Cover cropping** to prevent soil erosion and fix nitrogen naturally\n- **Minimal tillage** to preserve soil structure and microbial communities\n- **Crop rotation** to break pest cycles and improve soil fertility\n- **Composting** to return organic matter to the soil\n- **Integrated pest management** to reduce chemical inputs\n\n## Technology Meets Tradition\n\nModern technology is helping us farm smarter. Precision agriculture tools allow us to:\n\n- Monitor soil moisture and nutrient levels in real-time\n- Apply water and fertilizer exactly where needed\n- Track crop health using satellite imagery\n- Predict optimal harvest times using weather data\n\n## Looking Ahead\n\nThe future of agriculture is one where technology and traditional wisdom work hand in hand. By investing in sustainable practices today, we're building a more resilient food system for tomorrow.\n\nAt GreenFields, every product we offer reflects our commitment to this vision. When you choose our products, you're supporting a farming revolution that benefits people and planet alike.",
                "author": "Dr. Sarah Mitchell",
                "tags": "sustainability,farming,regenerative agriculture,organic",
                "is_published": True,
                "published_at": datetime(2025, 11, 15, tzinfo=timezone.utc),
            },
            {
                "title": "Understanding Organic Certification: What It Really Means",
                "slug": "understanding-organic-certification",
                "excerpt": "A comprehensive guide to organic certifications and what they mean for consumers and farmers.",
                "content": "# Understanding Organic Certification\n\nOrganic certification is more than just a label—it represents a comprehensive system of farming that prioritizes environmental health, animal welfare, and consumer safety.\n\n## What Organic Really Means\n\nWhen a product carries an organic certification, it means:\n\n1. **No synthetic pesticides** - Only naturally derived pest control methods are used\n2. **No artificial fertilizers** - Soil fertility is maintained through compost, cover crops, and natural amendments\n3. **No GMOs** - Genetically modified organisms are prohibited\n4. **Regular inspections** - Farms and processing facilities are inspected annually\n5. **Detailed record-keeping** - Every aspect of production is documented\n\n## The Certification Process\n\nObtaining organic certification is rigorous and requires:\n\n- A three-year transition period where organic practices must be followed\n- Annual inspections by accredited certifying agencies\n- Comprehensive documentation of all farming practices\n- Compliance with national organic standards\n\n## Why It Matters\n\nOrganic farming benefits everyone:\n\n- **Consumers** get cleaner, more nutritious food\n- **Farmers** build healthier soil that's more productive long-term\n- **Communities** enjoy cleaner water and air\n- **Wildlife** thrives in pesticide-free environments\n\nAt GreenFields, all our organic products are certified by USDA-accredited agencies. We believe in transparency and welcome anyone who wants to learn more about our farming practices.",
                "author": "James Rodriguez",
                "tags": "organic,certification,food safety,consumer guide",
                "is_published": True,
                "published_at": datetime(2025, 12, 3, tzinfo=timezone.utc),
            },
            {
                "title": "From Farm to Table: Our Supply Chain Story",
                "slug": "farm-to-table-supply-chain",
                "excerpt": "Follow the journey of our products from field to your kitchen, and learn how we maintain quality at every step.",
                "content": "# From Farm to Table: Our Supply Chain Story\n\nEvery product that reaches your kitchen has a story. At GreenFields Agriculture, we take pride in every chapter of that story—from the moment a seed is planted to the moment our product arrives at your door.\n\n## The Growing Phase\n\nIt all starts in the field. Our partner farmers follow strict protocols:\n\n- Soil testing before each planting season\n- Selection of the best seed varieties for local conditions\n- Natural pest management throughout the growing season\n- Regular quality checks during crop development\n\n## Harvest & Processing\n\nTiming is everything in agriculture. We harvest at peak maturity to ensure:\n\n- Maximum nutritional content\n- Best flavor and aroma\n- Optimal shelf life\n\nOur processing facilities use state-of-the-art equipment while maintaining traditional quality standards. Every batch is tested for purity, moisture content, and nutritional value.\n\n## Quality Control\n\nOur multi-point quality control system includes:\n\n- Field-level inspections\n- Post-harvest sampling and testing\n- Processing facility audits\n- Final product testing before packaging\n- Random shelf-life monitoring\n\n## The Last Mile\n\nPacking and distribution are just as important as growing. We use:\n\n- Food-grade, eco-friendly packaging materials\n- Temperature-controlled storage\n- Efficient logistics to minimize transit time\n- Lot tracking for complete traceability\n\nWhen you open a GreenFields product, you can trace it back to the very farm where it was grown. That's our promise of transparency and quality.",
                "author": "Priya Sharma",
                "tags": "supply chain,quality,farm to table,transparency",
                "is_published": True,
                "published_at": datetime(2026, 1, 20, tzinfo=timezone.utc),
            },
        ]

        for post_data in blog_posts_data:
            existing = db.query(BlogPost).filter(BlogPost.slug == post_data["slug"]).first()
            if not existing:
                db.add(BlogPost(**post_data))
        db.commit()
        print("Blog posts seeded.")

        print("Database seeding completed successfully!")

    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
