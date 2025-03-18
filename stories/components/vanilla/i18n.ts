import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
    en: {
        translation: {
            validation: {
                required: 'This field is required',
                minLength: 'This field must be at least {{minLength}} characters',
                maxLength: 'This field must be at most {{maxLength}} characters',
                min: 'This field must be at least {{min}}',
                max: 'This field must be at most {{max}}',
                pattern: 'This field is invalid format',
            },
            auth: {
                username: {
                    label: 'Username',
                    placeholder: 'Enter your username'
                },
                password: {
                    label: 'Password'
                },
                rememberMe: 'Remember me',
                login: 'Login'
            }
        }
    },
    fr: {
        translation: {
            validation: {
                required: 'Ce champ est obligatoire',
                minLength: 'Ce champ doit comporter au moins {{minLength}} caractères',
                maxLength: 'Ce champ doit comporter au plus {{maxLength}} caractères',
                min: 'Ce champ doit être au moins {{min}}',
                max: 'Ce champ doit être au plus {{max}}',
                pattern: 'Ce champ est au format invalide',
            },
            auth: {
                username: {
                    label: 'Nom d\'utilisateur',
                    placeholder: 'Entrez votre nom d\'utilisateur'
                },
                password: {
                    label: 'Mot de passe',
                    placeholder: '••••••••'
                },
                rememberMe: 'Se souvenir de moi',
                login: 'S\'identifier'
            }
        }
    }
};

i18n
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
        resources,
        lng: 'en', // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
        // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
        // if you're using a language detector, do not define the lng option

        interpolation: {
            escapeValue: false // react already safes from xss
        }
    });

export {
    i18n
};
