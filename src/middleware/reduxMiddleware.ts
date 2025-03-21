import { Middleware } from "@reduxjs/toolkit";
import axios from "axios";
import { PayloadAction } from "@/services";

export const apiMiddleware: Middleware =
  (store) => (next) => async (action) => {
    const apiAction = action as PayloadAction;

    const { url, method, payload, name } = apiAction;
    if (apiAction.type === `api/request[${name}]`) {
      store.dispatch({
        type: `api/request[${name}]-pending`,
        payload: { url, method },
      });

      try {
        const config = {
          method,
          url: `${import.meta.env.VITE_API_URL}${url}`,
          data: payload,
          headers: {
            "Content-Type": "Application/JSON",
          },
        };

        const response = await axios(config);

        store.dispatch({
          type: `api/request[${name}]-succsess`,
          payload: response.data,
          meta: { method, url },
        });
      } catch (error) {
        store.dispatch({
          type: `api/request[${name}]-error`,
          payload: error as Error,
          meta: { method, url },
        });
      }
    }

    return next(action);
  };
