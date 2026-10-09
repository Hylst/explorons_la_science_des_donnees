/**
 * Page Contact : le site est 100 % statique et n'a aucun serveur pour recevoir un message.
 * Le formulaire prépare donc un e-mail (lien mailto:) que le visiteur envoie depuis sa propre messagerie ;
 * rien n'est affiché comme « envoyé » tant que le visiteur ne l'a pas envoyé lui-même.
 */
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useFormErrorHandling } from "@/hooks/use-error-handling";
import { CONTACT_EMAIL, GITHUB_URL, LINKEDIN_URL, HUB_URL, buildMailDraft } from "@/config/contact";
import { Mail, MessageSquare, User, Send, Github, Linkedin, Globe, Copy } from "lucide-react";
import { LICENSE_SPDX, SITE_NAME } from "@/config/site";

const EMPTY_FORM = { name: "", email: "", subject: "", message: "" };

/** Ouvre la messagerie du visiteur ; un lien cliqué (et non location.href) reste interceptable et accessible */
const openMailClient = (url: string) => {
  const link = document.createElement("a");
  link.href = url;
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  link.remove();
};

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};

/**
 * Contact component - Displays contact information and contact form
 * @returns JSX element containing the contact page
 */
const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState(EMPTY_FORM);
  // null tant que rien n'a été préparé ; tooLong : le corps n'a pas pu tenir dans le lien
  const [outcome, setOutcome] = useState<{ tooLong: boolean; copied: boolean; plainText: string } | null>(null);
  const formErrorHandling = useFormErrorHandling();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = (): boolean => {
    formErrorHandling.clearAllErrors();
    let isValid = true;

    if (!formData.name.trim()) {
      formErrorHandling.setFieldError('name', 'Le nom est requis');
      isValid = false;
    }

    if (!formData.email.trim()) {
      formErrorHandling.setFieldError('email', 'L\'adresse e-mail est requise');
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      formErrorHandling.setFieldError('email', 'Format d\'adresse e-mail invalide');
      isValid = false;
    }

    if (!formData.subject.trim()) {
      formErrorHandling.setFieldError('subject', 'Le sujet est requis');
      isValid = false;
    }

    if (!formData.message.trim()) {
      formErrorHandling.setFieldError('message', 'Le message est requis');
      isValid = false;
    } else if (formData.message.trim().length < 10) {
      formErrorHandling.setFieldError('message', 'Le message doit contenir au moins 10 caractères');
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const draft = buildMailDraft(formData);
    // Trop long pour un lien : le corps est copié pour être collé dans la messagerie
    const copied = draft.tooLong ? await copyToClipboard(draft.body) : false;
    openMailClient(draft.url);
    // Le formulaire n'est pas vidé : rien n'a été envoyé tant que le visiteur ne l'a pas fait lui-même
    setOutcome({ tooLong: draft.tooLong, copied, plainText: draft.plainText });
  };

  const copyMessage = async () => {
    if (!outcome) return;
    const ok = await copyToClipboard(outcome.plainText);
    toast({
      title: ok ? "Message copié" : "Copie impossible",
      description: ok
        ? "Collez-le dans votre messagerie, ou dans un message adressé à " + CONTACT_EMAIL + "."
        : "Sélectionnez le texte du formulaire et copiez-le manuellement.",
      variant: ok ? "default" : "destructive"
    });
  };

  const copyAddress = async () => {
    const ok = await copyToClipboard(CONTACT_EMAIL);
    toast({
      title: ok ? "Adresse copiée" : "Copie impossible",
      description: ok ? CONTACT_EMAIL : "Adresse : " + CONTACT_EMAIL,
      variant: ok ? "default" : "destructive"
    });
  };

  return (
    <Layout>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-8">
          <Mail className="mx-auto h-16 w-16 text-blue-600 mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Écrire à l'auteur
          </h1>
          <p className="text-xl text-gray-600">
            Une question, une suggestion, une erreur à signaler ou une envie de collaborer ?
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  À propos de Geoffroy Streit
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Ancien ingénieur, développeur d'applications et autodidacte en data science, créateur de {SITE_NAME},
                  je partage mes apprentissages et mes découvertes dans ce domaine.
                  N'hésitez pas à me contacter pour échanger sur vos projets ou poser vos questions.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-gray-600" />
                    <a
                      href={`mailto:${CONTACT_EMAIL}`}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      {CONTACT_EMAIL}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Github className="h-5 w-5 text-gray-600" />
                    <a
                      href={GITHUB_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      Profil GitHub
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Linkedin className="h-5 w-5 text-gray-600" />
                    <a
                      href={LINKEDIN_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      Profil LinkedIn
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-gray-600" />
                    <a
                      href={HUB_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      hylst.fr, la plateforme de cours et d'outils
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Types de messages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Questions techniques</h3>
                      <p className="text-sm text-gray-600">Aide sur les concepts de data science, outils, méthodes</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Suggestions d'amélioration</h3>
                      <p className="text-sm text-gray-600">Idées pour enrichir le contenu du site</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Collaborations</h3>
                      <p className="text-sm text-gray-600">Projets communs, partage d'expériences</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-orange-600 rounded-full mt-2"></div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Signalement d'erreurs</h3>
                      <p className="text-sm text-gray-600">Bugs, liens cassés, problèmes techniques</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-gray-600 rounded-full mt-2"></div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Code source</h3>
                      <p className="text-sm text-gray-600">
                        Le code du site est publié sous licence {LICENSE_SPDX} : vous pouvez en demander les sources ici
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5" />
                  Écrire un message
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Ce site n'a pas de serveur : le formulaire prépare un e-mail dans votre messagerie,
                  que vous envoyez vous-même.
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nom *</Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="Votre nom"
                        className={formErrorHandling.getFieldError('name') ? 'border-red-500' : ''}
                      />
                      {formErrorHandling.getFieldError('name') && (
                        <p className="text-sm text-red-600">{formErrorHandling.getFieldError('name')}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Adresse e-mail *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="votre.adresse@example.com"
                        className={formErrorHandling.getFieldError('email') ? 'border-red-500' : ''}
                      />
                      {formErrorHandling.getFieldError('email') && (
                        <p className="text-sm text-red-600">{formErrorHandling.getFieldError('email')}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Sujet *</Label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      placeholder="Sujet de votre message"
                      className={formErrorHandling.getFieldError('subject') ? 'border-red-500' : ''}
                    />
                    {formErrorHandling.getFieldError('subject') && (
                      <p className="text-sm text-red-600">{formErrorHandling.getFieldError('subject')}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      placeholder="Votre message..."
                      rows={6}
                      className={formErrorHandling.getFieldError('message') ? 'border-red-500' : ''}
                    />
                    {formErrorHandling.getFieldError('message') && (
                      <p className="text-sm text-red-600">{formErrorHandling.getFieldError('message')}</p>
                    )}
                  </div>

                  <Button type="submit" className="w-full">
                    <Mail className="h-4 w-4 mr-2" />
                    Préparer l'e-mail
                  </Button>
                </form>

                {outcome && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg space-y-3" role="status" aria-live="polite">
                    <p className="text-sm text-green-900">
                      <strong>Votre message n'est pas encore parti.</strong>{" "}
                      {outcome.tooLong
                        ? outcome.copied
                          ? "Il est long : votre messagerie s'ouvre avec l'objet, et le texte a été copié dans le presse-papiers. Collez-le dans le corps du message, puis envoyez-le."
                          : "Il est long : votre messagerie s'ouvre avec l'objet seulement. Copiez le texte avec le bouton ci-dessous, collez-le dans le corps du message, puis envoyez-le."
                        : "Votre messagerie s'ouvre avec le message pré-rempli : vérifiez-le puis envoyez-le depuis votre messagerie."}
                    </p>
                    <p className="text-sm text-green-900">
                      Rien ne s'ouvre (messagerie web, aucun logiciel configuré) ? Copiez le message ou l'adresse
                      et écrivez à <strong>{CONTACT_EMAIL}</strong>.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Button type="button" variant="outline" size="sm" onClick={copyMessage}>
                        <Copy className="h-4 w-4 mr-1" />
                        Copier le message
                      </Button>
                      <Button type="button" variant="outline" size="sm" onClick={copyAddress}>
                        <Copy className="h-4 w-4 mr-1" />
                        Copier l'adresse
                      </Button>
                      <Button type="button" variant="ghost" size="sm" onClick={() => { setFormData(EMPTY_FORM); setOutcome(null); }}>
                        Effacer le formulaire
                      </Button>
                    </div>
                  </div>
                )}

                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Temps de réponse :</strong> Je m'efforce de répondre à tous les messages
                    dès que possible. Merci de votre patience.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
