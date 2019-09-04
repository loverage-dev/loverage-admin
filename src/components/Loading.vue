<template>
  <div class="t-contents box" v-show="isShow">
    <div class="spinner">
      <div class="cube1"></div>
      <div class="cube2"></div>
    </div>
  </div>
</template>

<script>
import store from "../store";
import { setTimeout } from 'timers';

export default{
  created(){
    store.$on("START_LOADING", () => {
        this.isShow = true
        store.$on("END_LOADING", () => {
        this.isShow = false
        });
    });
  },
  data() {
    return {
      isShow: true,
      overlayPosition: {
        top: "0"
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.box {
  height: 100vh;
  display: -webkit-flex;
  display: flex;
  -webkit-align-items: center; /* 縦方向中央揃え（Safari用） */
  align-items: center; /* 縦方向中央揃え */
  -webkit-justify-content: center; /* 横方向中央揃え（Safari用） */
  justify-content: center; /* 横方向中央揃え */
}
.spinner {
  margin: 100px auto;
  width: 35px;
  height: 40px;
  position: relative;
}

.cube1,
.cube2 {
  width: 20px;
  height: 20px;
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 4px;
  -webkit-animation: sk-cubemove 1.8s infinite ease-in-out;
  animation: sk-cubemove 1.8s infinite ease-in-out;
}

.cube1 {
  background-color: rgb(230, 121, 121);
}
.cube2 {
  background-color: rgb(121, 168, 230);
  -webkit-animation-delay: -0.9s;
  animation-delay: -0.9s;
}

@-webkit-keyframes sk-cubemove {
  25% {
    -webkit-transform: translateX(42px) rotate(-90deg) scale(0.5);
  }
  50% {
    -webkit-transform: translateX(42px) translateY(42px) rotate(-180deg);
  }
  75% {
    -webkit-transform: translateX(0px) translateY(42px) rotate(-270deg)
      scale(0.5);
  }
  100% {
    -webkit-transform: rotate(-360deg);
  }
}

@keyframes sk-cubemove {
  25% {
    transform: translateX(42px) rotate(-90deg) scale(0.5);
    -webkit-transform: translateX(42px) rotate(-90deg) scale(0.5);
  }
  50% {
    transform: translateX(42px) translateY(42px) rotate(-179deg);
    -webkit-transform: translateX(42px) translateY(42px) rotate(-179deg);
  }
  50.1% {
    transform: translateX(42px) translateY(42px) rotate(-180deg);
    -webkit-transform: translateX(42px) translateY(42px) rotate(-180deg);
  }
  75% {
    transform: translateX(0px) translateY(42px) rotate(-270deg) scale(0.5);
    -webkit-transform: translateX(0px) translateY(42px) rotate(-270deg)
      scale(0.5);
  }
  100% {
    transform: rotate(-360deg);
    -webkit-transform: rotate(-360deg);
  }
}
</style>
