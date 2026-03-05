import React from 'react';
import Button from '../Button';
import { ALL_BUTTONS } from '@site/src/data/buttons';
import clsx from 'clsx'; // Import the clsx utility

export default function ButtonGrid({ buttonKeys }) {
  if (!buttonKeys || buttonKeys.length === 0) {
    return null;
  }

  const totalButtons = buttonKeys.length;
  // Check if the total number of buttons is odd
  const isOddCount = totalButtons % 2 !== 0;

  return (
    <div className="row">
      {buttonKeys.map((key, index) => {
        const button = ALL_BUTTONS[key];
        if (!button) {
          console.warn(`Button with key "${key}" not found.`);
          return null;
        }

        // We only center the button if the total count is odd
        // AND this is the very last button in the list.
        const shouldCenter = isOddCount && (index === totalButtons - 1);

        const colClassName = clsx('col col--6', {
          'col--offset-3': shouldCenter,
        });
        
        return (
          <div className={colClassName} key={key} style={{ marginBottom: '1rem' }}>
            <Button
              link={button.link}
              line1={button.line1}
              line2Content={button.line2Content}
            />
          </div>
        );
      })}
    </div>
  );
}