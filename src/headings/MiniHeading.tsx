import React from 'react';
import './headings.css';

interface Props {
    heading: string;
}

const MiniHeading: React.FC<Props> = ({ heading }) => <div className="miniheading">{heading}</div>;

export default MiniHeading;
