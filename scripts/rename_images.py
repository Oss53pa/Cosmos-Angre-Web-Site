"""
Script pour renommer les images extraites selon la nomenclature Cosmos Angré
"""
import os
import shutil

BRANDING_DIR = r"Frontend\src\assets\images\branding"

# Mapping : fichier_source → nouveau_nom
RENAME_MAP = {
    # Page 1 - Couverture (la plus grande image sera le hero)
    "page_01_img_1.jpeg": "hero-exterior.jpg",
    "page_01_img_2.png": "logo-cosmos-text.png",

    # Page 3 - Extérieur avec logo
    "page_03_img_1.jpeg": "exterior-building.jpg",

    # Page 4 - Plan 3D
    "page_04_img_1.jpeg": "aerial-3d-plan.jpg",

    # Page 5 - EDGE
    "page_05_img_1.jpeg": "edge-building.jpg",

    # Page 6 - Logo EDGE
    "page_06_img_3.png": "edge-logo.png",

    # Page 7 - Localisation
    "page_07_img_1.jpeg": "location-aerial.jpg",

    # Page 8 - Plan du centre
    "page_08_img_1.jpeg": "floor-plan.jpg",

    # Page 9 - Lifestyle
    "page_09_img_1.jpeg": "family-lifestyle.jpg",

    # Page 10 - Galerie
    "page_10_img_1.jpeg": "gallery-interior.jpg",
    "page_10_img_2.jpeg": "outdoor-court.jpg",

    # Page 11 - Escalators & Parking
    "page_11_img_1.jpeg": "gallery-escalators.jpg",
    "page_11_img_2.jpeg": "parking-outdoor.jpg",

    # Page 12 - Marché & Promenade
    "page_12_img_1.jpeg": "artisan-market.jpg",
    "page_12_img_2.jpeg": "promenade-park.jpg",

    # Page 13 - Visiteurs & Jardin
    "page_13_img_1.jpeg": "visitors-experience.jpg",
    "page_13_img_2.jpeg": "indoor-garden.jpg",

    # Page 14 - Polyclinique
    "page_14_img_1.jpeg": "medical-team.jpg",
    "page_14_img_2.jpeg": "cinema-screen.jpg",

    # Page 15 - Cinéma
    "page_15_img_1.jpeg": "cinema-experience.jpg",
    "page_15_img_2.jpeg": "medical-staff.jpg",

    # Page 16 - Bureaux
    "page_16_img_1.jpeg": "office-space.jpg",
    "page_16_img_2.jpeg": "hotels-facade.jpg",

    # Page 17 - Hôtels
    "page_17_img_1.jpeg": "ibis-styles-exterior.jpg",
    "page_17_img_2.jpeg": "adagio-exterior.jpg",

    # Page 18 - Logo final
    "page_18_full.png": "logo-cosmos-angre.png",
}

def rename_images():
    """Renomme les images selon la nomenclature"""

    print("=" * 70)
    print("RENOMMAGE DES IMAGES - COSMOS ANGRE")
    print("=" * 70)
    print(f"[*] Dossier: {BRANDING_DIR}\n")

    renamed_count = 0
    skipped_count = 0

    for old_name, new_name in RENAME_MAP.items():
        old_path = os.path.join(BRANDING_DIR, old_name)
        new_path = os.path.join(BRANDING_DIR, new_name)

        if os.path.exists(old_path):
            try:
                # Copier au lieu de renommer (garde l'original)
                shutil.copy2(old_path, new_path)
                print(f"[OK] {old_name:25s} -> {new_name}")
                renamed_count += 1
            except Exception as e:
                print(f"[ERROR] {old_name}: {e}")
        else:
            print(f"[SKIP] {old_name} (non trouve)")
            skipped_count += 1

    print("\n" + "=" * 70)
    print(f"[SUCCESS] Renommage termine!")
    print(f"[*] {renamed_count} images renommees")
    print(f"[*] {skipped_count} images ignorees")
    print("=" * 70)
    print("\n[*] Les images sont pret es pour le site web!")
    print("[*] Actualisez le navigateur sur http://localhost:5174/")

if __name__ == "__main__":
    rename_images()
