import 'reflect-metadata';

export default {
  SERVER_URL: `http://${ process.env.LOCAL_IP }:${ process.env.PORT?.toString() }`
}