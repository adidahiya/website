/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

// don't import normalize.css since typography.js already does that
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "./src/globalStyles.css";

import { FocusStyleManager } from "@blueprintjs/core";

FocusStyleManager.onlyShowFocusOnTabs();
