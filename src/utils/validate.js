export const MESSAGE_LIMIT = 500

// Order the fields appear on screen; used to focus the first invalid one.
export const FIELD_ORDER = ['name', 'email', 'company', 'teamSize', 'plan', 'message']

// DOM ids for each field, shared by the form and the "focus this field" helpers.
export const FIELD_IDS = {
  name: 'field-name',
  email: 'field-email',
  company: 'field-company',
  teamSize: 'field-team-size',
  plan: 'field-plan',
  message: 'field-message',
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

// Pure function: form values in, errors object out. An empty object means the form is valid.
export function validate(values) {
  const errors = {}

  if (values.name.trim().length < 2) {
    errors.name = 'Enter your name'
  }
  if (!EMAIL.test(values.email.trim())) {
    errors.email = 'Enter an email like name@company.com'
  }
  if (!values.teamSize) {
    errors.teamSize = 'Pick a team size'
  }
  if (values.message.length > MESSAGE_LIMIT) {
    errors.message = `Keep the message under ${MESSAGE_LIMIT} characters`
  }

  return errors
}
