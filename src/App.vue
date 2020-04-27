<template>
  <div id="app" style="height: 100vh">
    <div
      id="permissions-request-wrapper"
      class="d-flex align-items-center justify-content-center"
    >
      <div v-if="!urlError" class="p-3 wrapper">
        <h1>Grant permissions</h1>
        <p>
          Jelly-Party requires permissions to work on
          <span id="request-url" class="font-weight-bold">
            {{ simplifiedURL }}</span
          >. Click the below button to grant Jelly-Party permissions.
        </p>
        <p>
          You will have to do this <b>once</b> for every website you want to use
          Jelly-Party on.
        </p>
        <b-button block size="lg" class="mt-2" @click="grantPermissions"
          >Grant permissions now</b-button
        >
      </div>
      <div v-else class="p-3 wrapper">
        <h1>Uh-Oh</h1>
        <p>
          It looks like the link you received is broken. Sorry about this! If
          this problem persists, please contact us
          <a href="mailto:hi@jelly-party.com">via email</a> or let us know on
          our <a href="https://discord.gg/H3dExqc">Discord channel.</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
var redirectURL, jellyPartyId;
var permissionURL;
const extensionId = "aiecbkandfgpphpdilbaaagnampmdgpd";
export default {
  name: "App",
  data: function() {
    return { simplifiedURL: "this website", urlError: false };
  },
  mounted: function() {
    const urlParams = new URLSearchParams(window.location.search);
    redirectURL = decodeURIComponent(urlParams.get("redirectURL"));
    jellyPartyId = urlParams.get("jellyPartyId");
    if (!redirectURL || !jellyPartyId) {
      this.urlError = true;
    } else {
      permissionURL = redirectURL.match(/https?:\/\/.+?\//)[0];
      this.simplifiedURL = redirectURL.match(/https?:\/\/(.+?)\//)[1];
      // Next we must inform the background script that we would like to
      // be redirected to redirectURL. The background script will check
      // if we have the permissions
      this.requestRedirect();
    }
  },
  methods: {
    grantPermissions: function() {
      chrome.permissions.request(
        {
          origins: [permissionURL],
        },
        function(granted) {
          if (granted) {
            console.log(
              "Jelly-Party: Permission granted. Redirecting. Content script will now be inserted automatically, since permissions have been granted."
            );
          } else {
            console.log("Jelly-Party: Permission not granted.");
          }
        }
      );
      this.requestRedirect();
    },
    requestRedirect: function() {
      let obj = { redirectURL: redirectURL, jellyPartyId: jellyPartyId };
      chrome.runtime.sendMessage(extensionId, obj, function(response) {
        if (!response.success) {
          console.log(
            "Jelly-Party: It looks like we still need to ask for permissions for this website.."
          );
        }
      });
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 0 auto;
  background: linear-gradient(
    to bottom right,
    rgba(145, 100, 255, 0.2) 0%,
    rgba(139, 255, 244, 0.2) 100%
  );
}

#permissions-request-wrapper {
  height: 100%;
}

.wrapper {
  max-width: 30em;
}
</style>
