interface ICardSelector {
  title: string;
  logo?: string;
  alt?: string;
  selected: boolean;
  width?: string;
  description?: string;
  onClick?: () => void;
  disabled?: boolean;
  horizontal?: boolean;
}

const CardSelector = ({
  title,
  logo,
  alt,
  selected,
  description,
  width,
  onClick,
  disabled,
  horizontal,
}: ICardSelector) => {
  return (
    <>
      {' '}
      <button
        disabled={disabled}
        className={`border p-7 rounded-lg flex-col flex ${
          !horizontal && 'items-center justify-center'
        }
              ${
                selected && 'border-scorebox-blue border-2 bg-scorebox-blue/10'
              } ${disabled && 'opacity-50 bg-black/10 hover:bg-black/10'}`}
        style={
          horizontal ? { width: '400px' } : { width: '200px', height: '200px' }
        }
        onClick={onClick}
      >
        <div className={`flex  ${!horizontal && 'flex-col'}  items-center`}>
          {logo && (
            <img
              src={`/images/${logo}`}
              alt={alt}
              className='pb-4'
              style={{ width: width }}
            />
          )}
          <div>
            <h3
              className={`text-xl ${horizontal && 'text-left tracking-tight'}`}
            >
              {title}
            </h3>
            <div
              className={`${
                horizontal && 'text-left'
              } text-gray-500 font-light tracking-tight`}
            >
              {description}
            </div>
          </div>
        </div>
      </button>
    </>
  );
};

export default CardSelector;
