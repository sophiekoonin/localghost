module.exports = {
  baseUrl: process.env.BASE_URL || 'https://localghost.dev',
  twitterUsername: '@type__error',
  description: `Sophie's website`,
  currentYear() {
    return new Date().getFullYear();
  },
  random() {
    const segment = () => {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return `${segment()}-${segment()}-${segment()}`;
  },
  isDev() {
    return process.env.NODE_ENV !== 'production';
  },
};
