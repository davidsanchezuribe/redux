import LocalizedStrings, { LocalizedStringsMethods } from 'react-localization';

export interface IStrings extends LocalizedStringsMethods {
  example: string;
  homepage: {
    helloWorld: string,
  },
  pageNotFound: {
    pageNotFound: string,
  },
  navBar: {
    account: string,
    signIn: string,
    signUp: string,
    logout: string,
    greeting: string,
  },
}

const messages: IStrings = new LocalizedStrings({
  en: {
    example: 'Example',
    homepage: {
      helloWorld: 'Hello World',
    },
    pageNotFound: {
      pageNotFound: 'Page Not Found',
    },
    navBar: {
      account: 'Account',
      signIn: 'Log in',
      signUp: 'Sign Up',
      logout: 'Logout',
      greeting: 'Hello',
    },
  },
  es: {
    example: 'Ejemplo',
    homepage: {
      helloWorld: 'Hola Mundo',
    },
    pageNotFound: {
      pageNotFound: 'Página no encontrada',
    },
    navBar: {
      account: 'Cuenta',
      signIn: 'Ingresar',
      signUp: 'Registrarse',
      logout: 'Cerrar Sesión',
      greeting: 'Hola',
    },
  },
});

export default messages;
