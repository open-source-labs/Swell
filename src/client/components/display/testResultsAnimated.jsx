import React, { useRef, useState, useEffect, Component } from 'react';
import { useSpring, animated } from 'react-spring';
import ResizeObserver from 'resize-observer-polyfill';
import { Spring, config } from 'react-spring';

const VerticalProgress = (props) => {
  const { total, pass } = props;
  const passed = Math.floor((pass / total) * 100);
  const passedFract = (pass / total).toFixed(2);

  const useMeasure = () => {
    const mounted = true;
    const ref = useRef();
    const [bounds, set] = useState({ left: 0, top: 0, width: 0, height: 0 });
    const [ro] = useState(
      () => new ResizeObserver(([entry]) => set(entry.contentRect))
    );
    useEffect(() => {
      ro.observe(ref.current), ro.disconnect;
    }, [ro]);
    return [{ ref }, bounds];
  };

  const [bind, { width }] = useMeasure();
  const adjWidth = width * passedFract;
  const springProps = useSpring({
    width: adjWidth,
    config: { duration: 1000 },
  });

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <div {...bind} className="animatedmain">
      <animated.div className="animatedfill" style={springProps} />
      <animated.div className="animatedcontent">
        <Spring
          from={{ number: 0 }}
          to={{ number: passed }}
          config={{ tension: 280, duration: 800 }}
        >
          {(props) => <div>{props.number.toFixed(0)}% Passed</div>}
        </Spring>
        {/* {springProps.width.interpolate(x => x.toFixed(2))} */}
      </animated.div>
    </div>
  );
};

export default VerticalProgress;
