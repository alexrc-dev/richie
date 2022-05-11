const getBasename = (locale: string) => {
  return `${locale.split(/[-_]/)[0]}/dashboard`;
};

export default getBasename;
