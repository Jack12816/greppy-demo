/**
 * Helping method for doing repeatedly tasks.
 *
 * @typedef HelperMethod
 * @type {Function}
 */

/**
 * All actions for a controller will be written within this object.
 *
 * @typedef ControllerActionsPool
 * @type {Object}
 */

/**
 * A common controller action definiton.
 *
 * @typedef ControllerAction
 * @type {Object}
 *
 * @property {Array}    methods - HTTP methods which will can be handled.
 * @property {String}   path    - Route path with all :variable parameters.
 * @property {Function} action  - Action implementation.
 */

/**
 * A common controller option definiton.
 *
 * @typedef ControllerOptions
 * @type {Object}
 *
 * @property {String} path - Route path prefix for all action inside the controller.
 */

