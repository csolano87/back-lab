const { default: axios } = require("axios");
const { getToken, loginInfinity, getCookieJar } = require("./loginInfinity");
const { wrapper } = require("axios-cookiejar-support");
const tough = require("tough-cookie");

const cookieJar = getCookieJar();

const axiosClient = wrapper(
	axios.create({
		baseURL: `${process.env.baseURL}`,
		withCredentials: true,
		jar: cookieJar,
		
	})
);

axiosClient.interceptors.request.use(
	async (config) => {
		let token = getToken();
		console.log(`configtoken`, token);

		if (!token || token == null) {
			token = await loginInfinity();
		}
		config.params = config.params || {};

		config.params.pstrSessionKey = token;
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

axiosClient.interceptors.response.use(
	async (response) => {
		const data = response.data;

		
		if (typeof data === "string" && data.includes("<html")) {
			console.warn(
				"⚠️ Se recibió HTML, posiblemente por sesión expirada. Reintentando login..."
			);

			try {
				const token = await loginInfinity();

        const cleanRequest = {
          method: response.config.method,
          url: response.config.url,
          headers: response.config.headers,
          data: response.config.data,
          params: {
            ...(response.config.params || {}),
            pstrSessionKey: token,
          },
        };

        return axiosClient(cleanRequest);
			} catch (err) {
				console.error(" Error al hacer login automático:", err);
				return Promise.reject(err);
			}
		}

		return response;
	},
	(error) => {
		console.error(" Interceptor de error:", error);
		return Promise.reject(error);
	}
);

module.exports = { axiosClient };
