import Pocketbase from "pocketbase";
export default defineNuxtRouteMiddleware((to, from) => {
  const pb = new Pocketbase("http://localhost:8090");


  if (pb.authStore.isValid) {
    return;
  }

  if(to.path.startsWith("/auth")) {
    return;
  }
  
  // In a real app you would probably not redirect every route to `/`
  // however it is important to check `to.path` before redirecting or you
  // might get an infinite redirect loop
  if (to.path !== "/auth") {
    return navigateTo("/auth");
  }
});
