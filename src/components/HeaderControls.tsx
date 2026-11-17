import {LocaleSwitcher} from './LocaleSwitcher';
import {ThemeSwitcher} from './ThemeSwitcher';

/** Theme and language switchers, next to the brand in the header. */
export function HeaderControls() {
  return (
    <div className="headerControls">
      <ThemeSwitcher />
      <LocaleSwitcher />
    </div>
  );
}
