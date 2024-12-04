

const environments = {
    development: "http://localhost:5000",
    production: "https://apigestionindicadores.sanagustin.edu.bo",
  };
  
  const baseURL = environments[process.env.NODE_ENV] || environments.development;
  
  export default baseURL;
  