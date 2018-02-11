<template>
  <div class="site">
    <sponge-navigation>
      <b-nav-item>
        News
      </b-nav-item>
      <b-nav-item>
        Downloads
      </b-nav-item>
      <b-nav-item>
        About
      </b-nav-item>
    </sponge-navigation>

    <div class="site-content">
      <div class="container content-container">
        <nuxt/>
      </div>
    </div>

    <sponge-footer id="footer">
      <div slot="terms">
        By using this site you're accepting our <a class="tos" href="#">Terms of Service</a>
      </div>
      <div slot="info">
        <b-container>
          <b-row>
            <b-col md="2">
              <h5>Ore API</h5>
              <a class="btn dark" href="https://docs.spongepowered.org/stable/en/ore/api.html">API</a>
            </b-col>
            <b-col md="2">
              <h5>Help Needed?</h5>
              <a class="btn dark" href="https://forums.spongepowered.org/c/plugins/ore-support">Forums</a>
            </b-col>
            <b-col md="4">
              <a href="https://www.spongepowered.org">
                <img class="spongie" src="~sponge-web-commons/images/icons/spongie-mark.svg"/>
              </a>
            </b-col>
            <b-col md="2">
              <h5>Found an Issue?</h5>
              <a class="btn dark" target="_blank" href="https://github.com/SpongePowered/Ore/issues">Issues</a>
            </b-col>
            <b-col md="2">
              <h5>Our Sponsors</h5>
              <a class="btn dark" href="https://www.spongepowered.org/sponsors">Sponsors</a>
            </b-col>
          </b-row>
        </b-container>
      </div>
    </sponge-footer>
  </div>
</template>

<style lang="scss">
  @import "~sponge-web-commons/styles/variables";

  $background: #f3f2f0;

  .site {
    display: flex;
    min-height: 100vh;
    flex-direction: column;
  }

  .site-content {
    flex: 1;
    background: $background;
    padding-bottom: 1rem;
  }

  .content-container {
    margin-top: $sponge_navigation_height + 1rem;
  }

  // Footer

  #footer {
    a.tos {
      color: #e5e5e5;
      font-size: 1em;
      padding: 0;
      text-decoration: underline;
    }

    h5 {
      font-size: 1.3em;
      font-weight: bold;
    }

    img.spongie {
      height: 60px;
      width: 60px;

      @media (min-width: 768px) {
        height: 74px;
        width: 74px;

        &:hover {
          animation-name: bounce;
          animation-duration: .5s;
          animation-fill-mode: both;
          animation-iteration-count: infinite;
        }

        @-webkit-keyframes bounce {
          0%, 100% {
            transform: rotateZ(0);
          }
          33% {
            transform: rotateZ(-5deg);
          }
          50% {
            transform: rotateZ(0);
          }
          76% {
            transform: rotateZ(5deg);
          }
        }
      }
    }

    @media (max-width: 768px) {
      [class*="col-"] {
        margin: 1em 0;
      }

      h5 {
        margin-top: 0;
      }
    }
  }
</style>
