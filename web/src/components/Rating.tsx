import { Icon } from "@iconify/react";

export function Rating(props: { value: number; text?: string }) {
  return (
    <div className="rating">
      <RenderRatingIcon value={props.value} />
      <span className="rating-text">{props.text ?? props.text}</span>
    </div>
  );
}

function RenderRatingIcon(props: { value: number }) {
  return (
    <>
      <span>
        {[1, 2, 3, 4, 5].map((num, idx) =>
          props.value >= num ? (
            <Icon
              key={idx}
              icon="fluent:star-12-filled"
              width="20"
              height="20"
            />
          ) : props.value >= num - 0.5 ? (
            <Icon
              key={idx}
              icon="fluent:star-half-12-regular"
              width="20"
              height="20"
            />
          ) : (
            <Icon
              key={idx}
              icon="fluent:star-12-regular"
              width="20"
              height="20"
            />
          ),
        )}
      </span>
    </>
  );
}
