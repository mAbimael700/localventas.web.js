export function getUserNavName(fullName) {
  if (fullName) {
    const nameParts = fullName.split(" ");
    const [firstName, middleName, lastName] = nameParts;

    if (lastName) {
      return `${firstName} ${lastName}`;
    } else if (middleName) {
      return `${firstName} ${middleName}`;
    }
  }

  return null
}

export function getUserNavFallback(fullName) {
  if (fullName) {
    const nameParts = fullName.split(" ");
    const [firstName, middleName, lastName] = nameParts;

    if (lastName) {
      const label = `${firstName.charAt(0)}${lastName.charAt(0)}`
      return label.toUpperCase();
    } else if (middleName) {
      const label = `${firstName.charAt(0)}${middleName.charAt(0)}`
      return label.toUpperCase();
    } else {
      const label = `${firstName.charAt(0)}`
      return label.toUpperCase();
    }
  }

  return null;
}
