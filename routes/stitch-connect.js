const {
  Stitch,
  UserPasswordAuthProviderClient
} = stitch;
const APP_ID = "marketapp-pgdcl";
const stitchClient = Stitch.initializeDefaultAppClient(APP_ID);
const emailPasswordClient = stitchClient.auth
  .getProviderClient(UserPasswordAuthProviderClient.factory, "userpass");

