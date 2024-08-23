"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Errors = void 0;
exports.getError = getError;
var Errors;
(function (Errors) {
    Errors["NULL"] = "Null";
    Errors["UNDEFINED"] = "Undefined";
    Errors["DLR"] = "Device Limit reached. You can edit your api key or visit dependi.io dashboard to manage devices.";
    Errors["IVDID"] = "Invalid device ID";
    Errors["PAYRQ"] = "Payment required. Please visit dependi.io dashboard to update your payment method.";
    Errors["UNAUTH"] = "Unauthorized, please check your api key.";
    Errors["IVAK"] = "Invalid api key or api key not found. Please check your api key.";
    Errors["UINA"] = "User is not active. Please check emails from us or visit dependi.io dashboard.";
})(Errors || (exports.Errors = Errors = {}));
function getError(error) {
    if (!error) {
        return Errors.NULL;
    }
    const code = error.split(" - ")[0];
    return Errors[code] || error;
}
//# sourceMappingURL=errors.js.map