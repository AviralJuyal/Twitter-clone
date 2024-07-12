// @ts-nocheck
import themesJSON from '../assets/data/themes.json';

export const useThemeService = () => {
  let activeTheme;
  let config;

  if (process.client) {
    config = useRuntimeConfig();
  }

  const themes = Object.values(themesJSON);

  /* Get all the available themes present in the library */
  const getAllThemes = () => {
    return themesConfig.themes;
  };

  /* Get the currently applied theme details */
  const getActiveTheme = () => {
    return activeTheme || activateTheme();
  };

  /* Get the default theme details which is present in themes config */
  const getDefaultTheme = () => {
    return themesConfig.themes[themesConfig.defaultThemeCode];
  };

  /* - create a map of theme(@key - theme code; @value - theme details)
	   - set any theme as default theme */
  const initThemes = (themes) => {
    const themesObject = {
      defaultThemeCode: undefined,
      themes: {}
    };
    themes.forEach(function (theme) {
      themesObject.themes[theme.meta.code] = theme;
    });
    themesObject.defaultThemeCode = 'theme-adult';

    return themesObject;
  };

  const themesConfig = initThemes(themes);

  /* @params - themeCode (can be found in 'themes.js' file as 'code' property inside every theme)
	set the passed theme as active theme (if not passed or incorrect code, default theme will be set as active) */
  const activateTheme = (themeCode?, ignoreLocalStorage = false) => {
    // check if given themeCode is valid and set it
    if (themeCode && themesConfig.themes[themeCode]) {
      activeTheme = themesConfig.themes[themeCode];
    }

    // check if a theme value exists in localstorage and is a valid entry and use it
    else if (
      localStorage.getItem('cup-global-theme') !== null &&
      localStorage.getItem('cup-global-theme') !== '' &&
      themesConfig.themes[localStorage.getItem('cup-global-theme')]
    ) {
      activeTheme =
        themesConfig.themes[localStorage.getItem('cup-global-theme')];
    }

    // set default theme if no theme found or wrong theme found
    else {
      activeTheme = themesConfig.themes[themesConfig.defaultThemeCode];
    }

    console.log('Activated theme : ' + activeTheme.meta.code);
    if (!ignoreLocalStorage) {
      localStorage.setItem('cup-global-theme', activeTheme.meta.code);
    }
    Object.keys(themesConfig.themes[activeTheme.meta.code].properties).forEach(
      function (property) {
        document.documentElement.style.setProperty(
          property,
          themesConfig.themes[activeTheme.meta.code].properties[property]
        );
        if (
          isValidHex(
            themesConfig.themes[activeTheme.meta.code].properties[property]
          )
        ) {
          document.documentElement.style.setProperty(
            property + '-rgb',
            hexToRGB(
              themesConfig.themes[activeTheme.meta.code].properties[property]
            )
          );
        }
      }
    );
    return activeTheme;
  };

  /**
   * @param {string} themeCode It can have three possible values i.e. primary, secondary & adult.
   * @param {string} elementId Element selector.
   */
  const activateThemeOnComponent = (themeCode, elementId) => {
    themeCode = `theme-${themeCode}`;

    // check if given themeCode is valid and set it
    if (themeCode && themesConfig.themes[themeCode]) {
      activeTheme = themesConfig.themes[themeCode];
    } else {
      activeTheme = themesConfig.themes[themesConfig.defaultThemeCode];
    }

    Object.keys(themesConfig.themes[activeTheme.meta.code].properties).forEach(
      (property) => {
        document
          .getElementById(elementId)
          .style.setProperty(
            property,
            themesConfig.themes[activeTheme.meta.code].properties[property]
          );
        if (
          isValidHex(
            themesConfig.themes[activeTheme.meta.code].properties[property]
          )
        ) {
          document
            .getElementById(elementId)
            .style.setProperty(
              property + '-rgb',
              hexToRGB(
                themesConfig.themes[activeTheme.meta.code].properties[property]
              )
            );
        }
      }
    );
  };

  /*	-	reset theme to default theme
		-	called when logging out
	*/
  const resetThemeToDefault = () => {
    const defaultTheme = getDefaultTheme();
    localStorage.setItem('cup-global-theme', defaultTheme.meta.code);
  };

  const isValidHex = (hex) => {
    return hex.match(/^#[0-9A-F]{6}$/i);
  };

  const hexToRGB = (hex) => {
    const arr = [
      ('0x' + hex[1] + hex[2]) | 0,
      ('0x' + hex[3] + hex[4]) | 0,
      ('0x' + hex[5] + hex[6]) | 0
    ];
    return arr[0] + ', ' + arr[1] + ', ' + arr[2];
  };

  const calculateAppTheme = (role: string) => {
    const path = window.location.pathname;
    let theme = config.public.themeTypes.adult.code;
    if (role == 'student' && path.indexOf('/login-primary') != -1) {
      theme = config.public.themeTypes.primary.code;
    } else if (role == 'student' && path.indexOf('/login-secondary') != -1) {
      theme = config.public.themeTypes.secondary.code;
    }
    return theme;
  };

  //This function is used to set app theme based on the maximum segment node in product
  // Priority order of segment node is mentioned in config.public
  const calculateAppThemeBasedOnproducts = (products: any[]) => {
    type themeTypes = keyof typeof config.public.themeTypes;
    let highestProductSegment: themeTypes | undefined;
    for (const particularProduct of products) {
      const bundleCode = particularProduct.meta['bundle-codes']
        ? particularProduct.meta['bundle-codes'][0]
        : undefined;
      if (bundleCode) {
        const particularBundleProduct = particularProduct.bundles[
          bundleCode
        ].products.find((bundleProduct: any) => {
          return (
            bundleProduct['dls-product'].code == particularProduct.productcode
          );
        });

        const productSegment: themeTypes = particularBundleProduct.segment
          ? particularBundleProduct.segment.segment
          : 'adult';
        if (
          !highestProductSegment ||
          config.public.themeTypes[highestProductSegment].priorityOrder >
            runtimeConfig.public.themeTypes[productSegment].priorityOrder
        )
          highestProductSegment = productSegment;
      }
    }
    return (
      highestProductSegment &&
      config.public.themeTypes[highestProductSegment].code
    );
  };

  const getProductsInClasses = (
    privateSpaceProducts: any,
    spacesOtherThanPrivate: any
  ) => {
    const productsInClasses: any = [];

    privateSpaceProducts.forEach((product: any, productIndex: number) => {
      spacesOtherThanPrivate.forEach((particularSpace: any) => {
        processSpaceClassesEntities(
          particularSpace,
          product,
          productIndex,
          productsInClasses
        );
      });
    });

    return productsInClasses;
  };

  const processSpaceClassesEntities = (
    particularSpace: any,
    product: any,
    productIndex: number,
    productsInClasses: any
  ) => {
    const classProductIndexArray: any = [];

    if (particularSpace.classes) {
      particularSpace.classes.entities.forEach((spaceClass: any) => {
        if (spaceClass.bundles && spaceClass.products[0]) {
          const bundleCode = spaceClass.products[0]['bundle-codes'][0];
          const olpBundleData = spaceClass.bundles[bundleCode].products;
          olpBundleData.forEach((particularBundle: any) => {
            if (
              particularBundle['ext-product'].type === 'OLP' &&
              particularBundle['dls-product'].code === product.productcode
            ) {
              if (classProductIndexArray.indexOf(productIndex) === -1) {
                productsInClasses.push(product);
                classProductIndexArray.push(productIndex);
              }
            }
          });
        }
      });
    }
  };

  //This function checks whether to calculate data from class data or products data from spaces
  const calculateThemeFromSpacesData = (spaces: any) => {
    const timestamp = new Date().getTime();
    const spacesOtherThanPrivate = spaces.filter((space: any) => {
      return space.space_type != 'student-private';
    });
    spacesOtherThanPrivate.forEach((particulatSpace: any) => {
      particulatSpace.classes.entities =
        particulatSpace.classes.entities.filter(
          (particulatSpaceDetail: any) => {
            return particulatSpaceDetail.class.startdate <= timestamp;
          }
        );
    });
    const privateSpace = spaces.find(
      (space: any) => space.space_type === 'student-private'
    );

    if (privateSpace?.products?.length > 0) {
      const privateSpaceProducts = privateSpace.products;
      const productsInClasses = getProductsInClasses(
        privateSpaceProducts,
        spacesOtherThanPrivate
      );

      const theme =
        productsInClasses.length > 0
          ? calculateAppThemeBasedOnproducts(productsInClasses)
          : calculateAppThemeBasedOnproducts(privateSpaceProducts);

      return theme || config.public.themeTypes.adult.code;
    }
  };

  return {
    activateTheme,
    activateThemeOnComponent,
    resetThemeToDefault,
    getActiveTheme,
    getAllThemes,
    getDefaultTheme,
    initThemes,
    calculateAppTheme,
    calculateAppThemeBasedOnproducts,
    calculateThemeFromSpacesData
  };
};
