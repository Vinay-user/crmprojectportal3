
export const storage = {
  get(key) {
    try {
      const value = localStorage.getItem(key);

      if (!value) {
        return null;
      }

      return JSON.parse(value);
    } catch {
      return localStorage.getItem(key);
    }
  },

  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },

  remove(key) {
    localStorage.removeItem(key);
  },

  clear() {
    localStorage.clear();
  }
};




// const STORAGE_PREFIX = "crm_portal_";

// const getKey = (key) => `${STORAGE_PREFIX}${key}`;

// const storage = {
//   /**
//    * Save data to localStorage
//    */
//   set(key, value) {
//     try {
//       localStorage.setItem(getKey(key), JSON.stringify(value));
//       return true;
//     } catch (error) {
//       console.error(`Storage set error for "${key}":`, error);
//       return false;
//     }
//   },

//   /**
//    * Get data from localStorage
//    */
//   get(key, defaultValue = null) {
//     try {
//       const value = localStorage.getItem(getKey(key));

//       if (value === null) {
//         return defaultValue;
//       }

//       return JSON.parse(value);
//     } catch (error) {
//       console.error(`Storage get error for "${key}":`, error);
//       return defaultValue;
//     }
//   },

//   /**
//    * Remove data from localStorage
//    */
//   remove(key) {
//     try {
//       localStorage.removeItem(getKey(key));
//       return true;
//     } catch (error) {
//       console.error(`Storage remove error for "${key}":`, error);
//       return false;
//     }
//   },

//   /**
//    * Check whether a key exists
//    */
//   has(key) {
//     try {
//       return localStorage.getItem(getKey(key)) !== null;
//     } catch (error) {
//       console.error(`Storage has error for "${key}":`, error);
//       return false;
//     }
//   },

//   /**
//    * Clear all CRM Portal storage
//    */
//   clear() {
//     try {
//       const keysToRemove = [];

//       for (let i = 0; i < localStorage.length; i++) {
//         const key = localStorage.key(i);

//         if (key && key.startsWith(STORAGE_PREFIX)) {
//           keysToRemove.push(key);
//         }
//       }

//       keysToRemove.forEach((key) => {
//         localStorage.removeItem(key);
//       });

//       return true;
//     } catch (error) {
//       console.error("Storage clear error:", error);
//       return false;
//     }
//   },

//   /**
//    * Save authentication token
//    */
//   setToken(token) {
//     return this.set("token", token);
//   },

//   /**
//    * Get authentication token
//    */
//   getToken() {
//     return this.get("token", null);
//   },

//   /**
//    * Remove authentication token
//    */
//   removeToken() {
//     return this.remove("token");
//   },

//   /**
//    * Save current user
//    */
//   setUser(user) {
//     return this.set("user", user);
//   },

//   /**
//    * Get current user
//    */
//   getUser() {
//     return this.get("user", null);
//   },

//   /**
//    * Remove current user
//    */
//   removeUser() {
//     return this.remove("user");
//   },

//   /**
//    * Save theme
//    */
//   setTheme(theme) {
//     return this.set("theme", theme);
//   },

//   /**
//    * Get theme
//    */
//   getTheme() {
//     return this.get("theme", "light");
//   },

//   /**
//    * Save any application setting
//    */
//   setSetting(key, value) {
//     return this.set(`setting_${key}`, value);
//   },

//   /**
//    * Get application setting
//    */
//   getSetting(key, defaultValue = null) {
//     return this.get(`setting_${key}`, defaultValue);
//   },
// };

// export { storage };

// export default storage;


