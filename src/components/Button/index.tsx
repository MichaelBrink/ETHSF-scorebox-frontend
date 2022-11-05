import { ReactNode } from 'react';

import cx from 'classnames';
import { ClipLoader } from 'react-spinners';

interface IButtonClasses {
  container?: string;
  button?: string;
  bg?: string;
  hover?: string;
  textColor?: string;
}

interface IButtonField {
  text: string | ReactNode;
  classes?: IButtonClasses;
  onClick?: (e: React.ChangeEvent<any>) => void;
  isSubmit?: boolean;
  type?: BUTTON_ACTION;
  style?: BUTTON_STYLES;
  isDisabled?: boolean;
  isLoading?: boolean;
  id?: string;
}

export enum BUTTON_STYLES {
  DEFAULT = 'default',
  OUTLINE = 'outline',
  LINK = 'link',
  BLACK = 'dark',
}

export enum BUTTON_ACTION {
  SUBMIT = 'submit',
  BUTTON = 'button',
  RESET = 'reset',
}

export default function Button({
  onClick,
  text,
  classes,
  type,
  isDisabled = false,
  style = BUTTON_STYLES.DEFAULT,
  isLoading,
  id,
}: IButtonField) {
  const classnames = cx(
    {
      'inline-flex justify-center py-2 px-6 rounded-3xl focus:outline-none font-sans tracking-tight':
        style !== BUTTON_STYLES.LINK,
      'text-scorebox-blue hover:opacity-75 font-sans tracking-tight':
        style === BUTTON_STYLES.LINK,
      'text-scorebox-blue border-solid border-2 border-scorebox-blue py-2 cursor-pointer hover:bg-scorebox-blue/10':
        style === BUTTON_STYLES.OUTLINE,
      'text-white bg-scorebox-blue hover:opacity-75 cursor-pointer min-w-4 py-2':
        style === BUTTON_STYLES.DEFAULT,
      'disabled:opacity-70 cursor-default gradient-outline-grayscale':
        isDisabled || isLoading,
    },
    classes?.button || ''
  );

  const button = (
    <button
      disabled={isDisabled}
      onClick={onClick || undefined}
      type={type}
      id={id}
      className={classnames}
      style={{ minWidth: '100px' }}
    >
      {isLoading ? (
        <ClipLoader speedMultiplier={1.25} size={20} color='#fff' />
      ) : (
        text
      )}
    </button>
  );

  return (
    <div
      style={{
        borderRadius: '400px',
        padding: '3px',
        justifyItems: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        zIndex: '50',
      }}
      className={classes?.container}
    >
      {button}
    </div>
  );
}
