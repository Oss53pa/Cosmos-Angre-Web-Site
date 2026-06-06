import React, { useState } from 'react';
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Input,
  Textarea,
  Badge,
  Alert,
  Spinner,
  Modal,
} from '../components/common';
import { Search, Mail, ShoppingCart, Star, Heart } from 'lucide-react';

const ComponentsDemo: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container-cosmos">
        <h1 className="text-4xl font-poppins font-bold text-cosmos-blue mb-8 text-center">
          Design System - Cosmos Angré
        </h1>

        {/* Buttons */}
        <section className="mb-16">
          <h2 className="section-title">Buttons</h2>
          <Card>
            <CardHeader title="Button Variants" />
            <CardBody>
              <div className="flex flex-wrap gap-4">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="gold">Gold</Button>
                <Button variant="dark">Dark</Button>
                <Button variant="danger">Danger</Button>
                <Button variant="ghost">Ghost</Button>
              </div>

              <h3 className="text-lg font-semibold mt-6 mb-3">Sizes</h3>
              <div className="flex flex-wrap items-center gap-4">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
                <Button size="xl">Extra Large</Button>
              </div>

              <h3 className="text-lg font-semibold mt-6 mb-3">With Icons</h3>
              <div className="flex flex-wrap gap-4">
                <Button leftIcon={Search}>Search</Button>
                <Button variant="secondary" rightIcon={ShoppingCart}>
                  Add to Cart
                </Button>
                <Button variant="gold" leftIcon={Heart} rightIcon={Star}>
                  Favorite
                </Button>
              </div>

              <h3 className="text-lg font-semibold mt-6 mb-3">States</h3>
              <div className="flex flex-wrap gap-4">
                <Button isLoading>Loading</Button>
                <Button disabled>Disabled</Button>
                <Button isFullWidth>Full Width</Button>
              </div>
            </CardBody>
          </Card>
        </section>

        {/* Cards */}
        <section className="mb-16">
          <h2 className="section-title">Cards</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card hoverable>
              <CardHeader title="Card with Header" subtitle="This is a subtitle" />
              <CardBody>
                <p>This is a basic card with a header and body.</p>
              </CardBody>
            </Card>

            <Card>
              <CardHeader title="Card with Action" action={<Button size="sm">Action</Button>} />
              <CardBody>
                <p>This card has an action button in the header.</p>
              </CardBody>
              <CardFooter>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    Cancel
                  </Button>
                  <Button size="sm">Save</Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        </section>

        {/* Inputs */}
        <section className="mb-16">
          <h2 className="section-title">Inputs</h2>
          <Card>
            <CardBody>
              <div className="space-y-6">
                <Input label="Email" type="email" placeholder="votre@email.com" leftIcon={Mail} />

                <Input
                  label="Search"
                  placeholder="Rechercher..."
                  rightIcon={Search}
                  helperText="Tapez pour rechercher"
                />

                <Input
                  label="With Error"
                  error="Ce champ est requis"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />

                <Textarea
                  label="Message"
                  placeholder="Votre message..."
                  helperText="Maximum 500 caractères"
                />
              </div>
            </CardBody>
          </Card>
        </section>

        {/* Badges */}
        <section className="mb-16">
          <h2 className="section-title">Badges</h2>
          <Card>
            <CardBody>
              <div className="flex flex-wrap gap-3">
                <Badge variant="primary">Primary</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="danger">Danger</Badge>
                <Badge variant="info">Info</Badge>
                <Badge variant="gold">Gold</Badge>
                <Badge variant="night">Night</Badge>
                <Badge variant="cream">Cream</Badge>
              </div>

              <h3 className="text-lg font-semibold mt-6 mb-3">Sizes</h3>
              <div className="flex flex-wrap items-center gap-3">
                <Badge size="sm">Small</Badge>
                <Badge size="md">Medium</Badge>
                <Badge size="lg">Large</Badge>
              </div>

              <h3 className="text-lg font-semibold mt-6 mb-3">With Icons</h3>
              <div className="flex flex-wrap gap-3">
                <Badge icon={Star} variant="warning">
                  Featured
                </Badge>
                <Badge icon={Heart} variant="danger">
                  Loved
                </Badge>
                <Badge variant="success" removable onRemove={() => alert('Removed!')}>
                  Removable
                </Badge>
              </div>
            </CardBody>
          </Card>
        </section>

        {/* Alerts */}
        <section className="mb-16">
          <h2 className="section-title">Alerts</h2>
          <div className="space-y-4">
            <Alert variant="info" title="Information">
              Ceci est une alerte informative avec un titre.
            </Alert>

            <Alert variant="success" closable onClose={() => console.log('Closed')}>
              Votre opération a été effectuée avec succès !
            </Alert>

            <Alert variant="warning">Attention : Cette action nécessite votre confirmation.</Alert>

            <Alert variant="error" title="Erreur" icon={false}>
              Une erreur s'est produite lors du traitement de votre demande.
            </Alert>
          </div>
        </section>

        {/* Spinners */}
        <section className="mb-16">
          <h2 className="section-title">Spinners</h2>
          <Card>
            <CardBody>
              <div className="flex flex-wrap items-center gap-8">
                <Spinner size="sm" />
                <Spinner size="md" />
                <Spinner size="lg" />
                <Spinner size="xl" />
              </div>

              <h3 className="text-lg font-semibold mt-6 mb-3">Colors</h3>
              <div className="flex flex-wrap items-center gap-8">
                <Spinner color="primary" />
                <Spinner color="secondary" />
                <Spinner color="teal" />
                <Spinner color="red" />
              </div>

              <h3 className="text-lg font-semibold mt-6 mb-3">With Label</h3>
              <Spinner label="Chargement..." />
            </CardBody>
          </Card>
        </section>

        {/* Modal */}
        <section className="mb-16">
          <h2 className="section-title">Modal</h2>
          <Card>
            <CardBody>
              <Button onClick={() => setIsModalOpen(true)}>Ouvrir la Modal</Button>

              <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Exemple de Modal"
                footer={
                  <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                      Annuler
                    </Button>
                    <Button onClick={() => setIsModalOpen(false)}>Confirmer</Button>
                  </div>
                }
              >
                <p className="mb-4">
                  Ceci est un exemple de contenu de modal. Vous pouvez y mettre n'importe quel
                  contenu React.
                </p>
                <Input label="Nom" placeholder="Votre nom" />
              </Modal>
            </CardBody>
          </Card>
        </section>

        {/* Color Palette */}
        <section className="mb-16">
          <h2 className="section-title">Palette de Couleurs</h2>
          <Card>
            <CardBody>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="w-full h-24 bg-cosmos-blue rounded-xl mb-2"></div>
                  <p className="font-semibold">Cosmos Blue</p>
                  <p className="text-sm text-gray-600">#231F54</p>
                </div>
                <div className="text-center">
                  <div className="w-full h-24 bg-cosmos-red rounded-xl mb-2"></div>
                  <p className="font-semibold">Cosmos Red</p>
                  <p className="text-sm text-gray-600">#EB3737</p>
                </div>
                <div className="text-center">
                  <div className="w-full h-24 bg-cosmos-teal rounded-xl mb-2"></div>
                  <p className="font-semibold">Cosmos Teal</p>
                  <p className="text-sm text-gray-600">#00B6AA</p>
                </div>
                <div className="text-center">
                  <div className="w-full h-24 bg-cosmos-yellow rounded-xl mb-2"></div>
                  <p className="font-semibold">Cosmos Yellow</p>
                  <p className="text-sm text-gray-600">#FFD500</p>
                </div>
                <div className="text-center">
                  <div className="w-full h-24 bg-cosmos-purple rounded-xl mb-2"></div>
                  <p className="font-semibold">Cosmos Purple</p>
                  <p className="text-sm text-gray-600">#A31EB4</p>
                </div>
                <div className="text-center">
                  <div className="w-full h-24 bg-cosmos-pink rounded-xl mb-2"></div>
                  <p className="font-semibold">Cosmos Pink</p>
                  <p className="text-sm text-gray-600">#E61E73</p>
                </div>
              </div>
            </CardBody>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default ComponentsDemo;
