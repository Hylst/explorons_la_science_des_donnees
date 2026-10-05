/**
 * Coordonnées publiques de l'auteur, telles qu'il les publie déjà sur le hub https://hylst.fr/.
 * Le site est 100 % statique : il n'a aucun serveur pour recevoir des messages, le contact passe
 * par la messagerie du visiteur (lien mailto:).
 */
import { SITE_NAME } from "./site";

export const CONTACT_EMAIL = "geoffroy.streit@gmail.com";
export const GITHUB_URL = "https://github.com/Hylst";
export const LINKEDIN_URL = "https://www.linkedin.com/in/geoffroy-streit/";
export const HUB_URL = "https://hylst.fr/";

/** Préfixe des objets d'e-mail, pour que l'auteur reconnaisse l'origine du message */
export const MAIL_SUBJECT_PREFIX = `[${SITE_NAME}]`;

interface MailDraftInput {
  name: string;
  email: string;
  subject: string;
  message: string;
}

/** Lien mailto: vers l'auteur avec un objet prérempli (suggestions de flux, d'événement, de contenu...) */
export const mailtoLink = (subject: string) =>
  `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`${MAIL_SUBJECT_PREFIX} ${subject}`)}`;

/** Longueur maximale prudente d'un lien mailto: (certaines messageries coupent vers 2000 caractères) */
const MAILTO_MAX_LENGTH = 1800;

/**
 * Prépare un e-mail à partir du formulaire de contact.
 * `tooLong` : le lien complet dépasserait la limite ; `url` ne contient alors que l'objet
 * et le corps doit être copié puis collé par le visiteur.
 */
export const buildMailDraft = ({ name, email, subject, message }: MailDraftInput) => {
  const subjectLine = `${MAIL_SUBJECT_PREFIX} ${subject.trim()}`;
  const body = `${message.trim()}\n\n--\n${name.trim()} <${email.trim()}>`;
  const encode = (value: string) => encodeURIComponent(value.replace(/\r?\n/g, "\r\n"));
  const withBody = `mailto:${CONTACT_EMAIL}?subject=${encode(subjectLine)}&body=${encode(body)}`;
  const tooLong = withBody.length > MAILTO_MAX_LENGTH;
  return {
    subjectLine,
    body,
    tooLong,
    url: tooLong ? `mailto:${CONTACT_EMAIL}?subject=${encode(subjectLine)}` : withBody,
    /** Texte complet, à coller dans une messagerie web */
    plainText: `À : ${CONTACT_EMAIL}\nObjet : ${subjectLine}\n\n${body}`
  };
};
