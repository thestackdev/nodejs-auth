export default {
  origin: ['accounts.fullstaclab.org'],
  cookieOptions:
    process.env.NODE_ENV === 'dev'
      ? {
          httpOnly: false,
          secure: false,
          sameSite: 'none',
        }
      : {
          httpOnly: true,
          secure: true,
          sameSite: 'none',
        },
}
