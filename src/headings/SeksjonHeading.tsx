import React from 'react';
import './headings.css';

interface Props {
    heading: string;
}

const SeksjonHeading: React.FC<Props> = ({ heading }) => <h2 className="seksjonsheading">{heading}</h2>;

export default SeksjonHeading;
