import { SearchForm } from "../components/SearchForm";

export interface Location {
    iataCode: string;
    name: string;
    detailedName: string;
    subType: string;
    countryName: string;
}

export interface LocationInputProps {
    label: string;
    placeholder: string;
    value: Location | null;
    onChange: (location: Location) => void;
    icon?: React.ReactNode;
}

export interface LocationRequest {
    keyword: string;
}

export interface HeaderLink {
    href: string;
    label: string;
    pathname: string;
}

export interface SearchFormProps {
    onSearch: (origin: string, destination: string, date: string) => void;
    isLoading?: boolean;
}
