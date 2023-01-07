export const metamaskReducer = function (state = 0, action) {
    switch (action.type) {
        case "metamask":
            return {
                rotating: action.payload
            };
        default:
            return state;
    }
};