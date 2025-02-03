export { isChecked, setChecked, getValue, setValue };

/**
 *
 * @param htmlQuery Query for the CheckBox to be queried
 * @returns weather the CheckBox is checked.
 */
function isChecked(htmlQuery: string): boolean {
  const element = document.querySelector(htmlQuery) as HTMLInputElement;
  return element.checked;
}

/**
 *
 * @param htmlQuery Query for the CheckBox to be queried
 * @returns weather the CheckBox is checked.
 */
function setChecked(htmlQuery: string, isChecked: boolean): void {
  let element = document.querySelector(htmlQuery) as HTMLInputElement;
  element.checked = isChecked;
}

/**
 *
 * @param htmlQuery Query for the Input to be queried
 * @returns value of the input.
 */
function getValue(htmlQuery: string): any {
  const element = document.querySelector(htmlQuery);
  return (element as HTMLInputElement)?.value;
}

function setValue(htmlQuery: string, value: any): void {
  let element = document.querySelector(htmlQuery) as HTMLInputElement;
  element.value = value;
}
