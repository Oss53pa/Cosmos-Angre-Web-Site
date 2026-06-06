"""
Script pour extraire les images de la plaquette Cosmos Angré PDF
"""
import sys
import os

try:
    from pdf2image import convert_from_path
    import fitz  # PyMuPDF
    from PIL import Image
except ImportError:
    print("Installation des dépendances nécessaires...")
    print("Veuillez exécuter: pip install PyMuPDF pdf2image Pillow")
    sys.exit(1)

# Chemins
PDF_PATH = r"C:\Users\User\Dropbox\PRAEDIUM TECH- CONTROLLED DOCUMENT\PLAQUETTE FINALE.pdf"
OUTPUT_DIR = r"Frontend\src\assets\images\branding"

def extract_images_from_pdf(pdf_path, output_dir):
    """Extrait toutes les images d'un PDF"""

    # Créer le dossier de sortie s'il n'existe pas
    os.makedirs(output_dir, exist_ok=True)

    print(f"📄 Ouverture du PDF: {pdf_path}")

    try:
        # Ouvrir le PDF avec PyMuPDF
        pdf_document = fitz.open(pdf_path)
        total_pages = len(pdf_document)
        print(f"📖 Nombre de pages: {total_pages}")

        image_count = 0

        # Parcourir chaque page
        for page_num in range(total_pages):
            page = pdf_document[page_num]
            print(f"\n🔍 Page {page_num + 1}/{total_pages}")

            # Obtenir les images de la page
            image_list = page.get_images(full=True)

            if image_list:
                print(f"   ✅ {len(image_list)} image(s) trouvée(s)")

                for img_index, img in enumerate(image_list):
                    xref = img[0]
                    base_image = pdf_document.extract_image(xref)
                    image_bytes = base_image["image"]
                    image_ext = base_image["ext"]

                    # Nom du fichier
                    image_filename = f"page_{page_num + 1}_img_{img_index + 1}.{image_ext}"
                    image_path = os.path.join(output_dir, image_filename)

                    # Sauvegarder l'image
                    with open(image_path, "wb") as img_file:
                        img_file.write(image_bytes)

                    print(f"   💾 Sauvegardé: {image_filename}")
                    image_count += 1
            else:
                print(f"   ⚠️  Aucune image trouvée")

        pdf_document.close()

        print(f"\n✅ Extraction terminée!")
        print(f"📊 Total: {image_count} images extraites")
        print(f"📁 Emplacement: {output_dir}")

    except Exception as e:
        print(f"❌ Erreur lors de l'extraction: {e}")
        return False

    return True

def convert_pdf_pages_to_images(pdf_path, output_dir):
    """Convertit chaque page du PDF en image haute résolution"""

    print(f"\n📸 Conversion des pages en images...")

    try:
        # Convertir les pages en images (300 DPI pour haute qualité)
        pages = convert_from_path(pdf_path, dpi=200, fmt='png')

        for i, page in enumerate(pages):
            page_filename = f"page_{i + 1}_full.png"
            page_path = os.path.join(output_dir, page_filename)
            page.save(page_path, 'PNG')
            print(f"   💾 Page {i + 1} sauvegardée: {page_filename}")

        print(f"\n✅ {len(pages)} pages converties en images")

    except Exception as e:
        print(f"⚠️  Conversion des pages échouée: {e}")
        print("   Note: pdf2image nécessite Poppler. Continuons avec l'extraction simple.")

if __name__ == "__main__":
    print("=" * 60)
    print("🎨 EXTRACTION DES IMAGES - PLAQUETTE COSMOS ANGRÉ")
    print("=" * 60)

    # Vérifier que le PDF existe
    if not os.path.exists(PDF_PATH):
        print(f"❌ Fichier PDF non trouvé: {PDF_PATH}")
        sys.exit(1)

    # Extraire les images
    success = extract_images_from_pdf(PDF_PATH, OUTPUT_DIR)

    # Convertir les pages en images (optionnel)
    # convert_pdf_pages_to_images(PDF_PATH, OUTPUT_DIR)

    if success:
        print("\n" + "=" * 60)
        print("✅ EXTRACTION RÉUSSIE!")
        print("=" * 60)
        print(f"\n📂 Les images sont disponibles dans:")
        print(f"   {OUTPUT_DIR}")
        print("\nℹ️  Prochaine étape: Renommez les images selon leur contenu")
        print("   Exemple: page_1_img_1.jpg → hero-exterior.jpg")
    else:
        print("\n❌ L'extraction a échoué")
