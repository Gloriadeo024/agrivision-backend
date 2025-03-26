const translations = {
    en: {
        welcome: "Welcome",
        login: "Login",
        logout: "Logout"
    },
    fr: {
        welcome: "Bienvenue",
        login: "Se connecter",
        logout: "Se déconnecter"
    },
    sw: {  // Kiswahili
        welcome: "Karibu",
        login: "Ingia",
        logout: "Ondoka"
    },
    mjk: { // Mijikenda (Giriama example)
        welcome: "Bire",
        login: "Kenia",
        logout: "Hoka"
    }
};

module.exports = translations;

// backend/config/translations.js
const i18n = require('i18n');

i18n.configure({
  locales: ['en', 'sw', 'mijikenda'], // English, Kiswahili, Mijikenda languages
  directory: __dirname + '/locales', // Path to translations folder
  defaultLocale: 'en',
  objectNotation: true, // For nested translation keys
  autoReload: true, // Auto reload translations when updated
  syncFiles: true,
});

module.exports = i18n;


module.exports = {
    en: {
      welcome: {
        subject: 'Welcome to {{brandName}}!',
        greeting: 'Hello {{name}}',
        verifyEmail: 'To get started, please verify your email address by clicking the button below:',
        buttonText: 'Verify Email Address',
        expiry: 'This link will expire in 24 hours.',
        ignore: 'If you didnot create an account with us, please ignore this email.',
        regards: 'Goodbye',
        team: 'The {{brandName}} Team'
      },
      passwordReset: {
        subject: 'Password Reset Request',
        greeting: 'Hello {{name}}',
        message: 'We received a request to reset your password. Click the button below to create a new password:',
        buttonText: 'Reset Password',
        expiry: 'This link will expire in 1 hour.',
        ignore: 'If you didnot request a password reset, please ignore this email or contact support if you have concerns.'
      },
      accountUpdate: {
        subject: 'Account Update Notification',
        message: 'This email confirms that your {{updateType}} has been successfully updated.',
        warning: 'If you didnot make this change, please contact our support team immediately.'
      },
      footer: {
        rights: 'All rights reserved',
        contact: 'Contact us',
        followUs: 'Follow us on social media'
      }
    },
    es: {
      welcome: {
        subject: '¡Bienvenido a {{brandName}}!',
        greeting: 'Hola {{name}}',
        verifyEmail: 'Para comenzar, por favor verifica tu dirección de correo electrónico haciendo clic en el botón a continuación:',
        buttonText: 'Verificar Correo Electrónico',
        expiry: 'Este enlace expirará en 24 horas.',
        ignore: 'Si no creaste una cuenta con nosotros, por favor ignora este correo.',
        regards: 'Saludos cordiales',
        team: 'El equipo de {{brandName}}'
      },
      passwordReset: {
        subject: 'Solicitud de Restablecimiento de Contraseña',
        greeting: 'Hola {{name}}',
        message: 'Recibimos una solicitud para restablecer tu contraseña. Haz clic en el botón a continuación para crear una nueva contraseña:',
        buttonText: 'Restablecer Contraseña',
        expiry: 'Este enlace expirará en 1 hora.',
        ignore: 'Si no solicitaste un restablecimiento de contraseña, ignora este correo o contacta al soporte si tienes inquietudes.'
      },
      // Add more Spanish translations...
    },
    fr: {
      welcome: {
        subject: 'Bienvenue sur {{brandName}} !',
        greeting: 'Bonjour {{name}}',
        verifyEmail: 'Pour commencer, veuillez vérifier votre adresse e-mail en cliquant sur le bouton ci-dessous :',
        buttonText: 'Vérifier l\'adresse e-mail',
        expiry: 'Ce lien expirera dans 24 heures.',
        ignore: 'Si vous n\'avez pas créé de compte chez nous, veuillez ignorer cet e-mail.',
        regards: 'Cordialement',
        team: 'L\'équipe {{brandName}}'
      },
      // Add more French translations...
    },
    ar: {
      welcome: {
        subject: 'مرحباً بك في {{brandName}}!',
        greeting: 'مرحباً {{name}}',
        verifyEmail: 'للبدء، يرجى التحقق من بريدك الإلكتروني بالنقر على الزر أدناه:',
        buttonText: 'تحقق من البريد الإلكتروني',
        expiry: 'سينتهي هذا الرابط خلال 24 ساعة.',
        ignore: 'إذا لم تقم بإنشاء حساب معنا، يرجى تجاهل هذا البريد الإلكتروني.',
        regards: 'مع أطيب التحيات',
        team: 'فريق {{brandName}}'
      },
      passwordReset: {
        subject: 'طلب إعادة تعيين كلمة المرور',
        greeting: 'مرحباً {{name}}',
        message: 'تلقينا طلباً لإعادة تعيين كلمة المرور الخاصة بك. انقر على الزر أدناه لإنشاء كلمة مرور جديدة:',
        buttonText: 'إعادة تعيين كلمة المرور',
        expiry: 'سينتهي هذا الرابط خلال ساعة واحدة.',
        ignore: 'إذا لم تطلب إعادة تعيين كلمة المرور، يرجى تجاهل هذا البريد الإلكتروني.'
      },
      accountUpdate: {
        subject: 'إشعار تحديث الحساب',
        message: 'هذا البريد الإلكتروني يؤكد أنه تم تحديث {{updateType}} بنجاح.',
        warning: 'إذا لم تقم بهذا التغيير، يرجى الاتصال بفريق الدعم على الفور.'
      },
      footer: {
        rights: 'جميع الحقوق محفوظة',
        contact: 'اتصل بنا',
        followUs: 'تابعنا على وسائل التواصل الاجتماعي'
      }
    }
  }; 