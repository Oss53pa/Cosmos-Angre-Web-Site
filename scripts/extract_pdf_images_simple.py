"""
Script simple pour extraire les images de la plaquette PDF
Utilise PyMuPDF (fitz) qui est déjà installé
"""
import os
import sys

# Chemins
PDF_PATH = r"C:\Users\User\Dropbox\PRAEDIUM TECH- CONTROLLED DOCUMENT\PLAQUETTE FINALE.pdf"
OUTPUT_DIR = r"Frontend\src\assets\images\branding"

print("=" * 70)
print("EXTRACTION DES IMAGES - PLAQUETTE COSMOS ANGRE")
print("=" * 70)

# Vérifier que le PDF existe
if not os.path.exists(PDF_PATH):
    print(f"[ERROR] Fichier PDF non trouve: {PDF_PATH}")
    sys.exit(1)

# Créer le dossier de sortie
os.makedirs(OUTPUT_DIR, exist_ok=True)
print(f"[*] Dossier de sortie: {OUTPUT_DIR}\n")

try:
    import fitz  # PyMuPDF
    print("[OK] PyMuPDF importe avec succes\n")
except ImportError:
    print("[ERROR] PyMuPDF (fitz) n'est pas installe")
    print("Veuillez executer: pip install pymupdf")
    sys.exit(1)

# Ouvrir le PDF
try:
    pdf = fitz.open(PDF_PATH)
    print(f"[*] PDF ouvert: {len(pdf)} pages\n")

    total_images = 0

    # Parcourir chaque page
    for page_num in range(len(pdf)):
        page = pdf[page_num]
        print(f"[*] Page {page_num + 1}/{len(pdf)}")

        # Méthode 1: Extraire les images intégrées
        images = page.get_images(full=True)

        if images:
            print(f"   [OK] {len(images)} image(s) trouvee(s)")

            for img_index, img in enumerate(images):
                try:
                    xref = img[0]
                    base_image = pdf.extract_image(xref)
                    image_bytes = base_image["image"]
                    image_ext = base_image["ext"]

                    # Nom du fichier
                    filename = f"page_{page_num + 1:02d}_img_{img_index + 1}.{image_ext}"
                    filepath = os.path.join(OUTPUT_DIR, filename)

                    # Sauvegarder
                    with open(filepath, "wb") as f:
                        f.write(image_bytes)

                    print(f"      [SAVE] {filename}")
                    total_images += 1

                except Exception as e:
                    print(f"      [WARN] Erreur image {img_index + 1}: {e}")

        # Méthode 2: Convertir la page entière en image (fallback)
        else:
            print(f"   [INFO] Pas d'image integree, conversion de la page...")
            try:
                # Convertir la page en image PNG (haute résolution)
                pix = page.get_pixmap(matrix=fitz.Matrix(2, 2))  # 2x zoom = haute qualité
                filename = f"page_{page_num + 1:02d}_full.png"
                filepath = os.path.join(OUTPUT_DIR, filename)
                pix.save(filepath)
                print(f"      [SAVE] {filename} (page complete)")
                total_images += 1
            except Exception as e:
                print(f"      [WARN] Erreur conversion: {e}")

        print()

    pdf.close()

    print("=" * 70)
    print(f"[SUCCESS] EXTRACTION TERMINEE!")
    print(f"[*] Total: {total_images} image(s) extraite(s)")
    print(f"[*] Emplacement: {OUTPUT_DIR}")
    print("=" * 70)
    print("\n[*] Prochaine etape:")
    print("   1. Consultez EXTRACTION_IMAGES_SIMPLE.md")
    print("   2. Renommez les images selon le guide")
    print("   3. Le site web utilisera automatiquement les images!")

except Exception as e:
    print(f"\n[ERROR] ERREUR: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)
