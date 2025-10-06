import type { RouterConfig } from "@nuxt/schema";

export default <RouterConfig>{
  scrollBehavior(to, from, savedPosition) {
    // Handle saved position (browser back/forward)
    if (savedPosition) {
      return savedPosition;
    }
    
    // Handle hash/anchor links
    if (to.hash) {
      return {
        el: to.hash,
        behavior: "smooth",
        top: 80 // offset for header
      };
    }
    
    // Default to top of page
    return { top: 0, left: 0, behavior: "smooth" };
  }
};