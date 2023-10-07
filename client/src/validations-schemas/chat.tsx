import * as yup from "yup";

export const chatSchema = yup.object().shape({
  name: yup.string().required(),
  avatar: yup.string().required(),
  // type: yup.string().required(),
  // messages: yup.array().required(),
  // members: yup.array().required(),
  // creatorId: yup.string().required(),
});
