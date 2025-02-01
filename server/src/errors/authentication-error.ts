class AuthenticationError extends Error {
    statusCode: number;

    constructor(message: string) {
        super(message)
        this.statusCode = 401;
        Object.setPrototypeOf(this,AuthenticationError.prototype)
    }
}

export default AuthenticationError