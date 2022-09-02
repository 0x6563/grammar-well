head ${
    const tokenPrint = { literal: "print" };
    const tokenNumber = { test: x => Number.isInteger(x) };
}

grammar {{
    main -> $tokenPrint $tokenNumber ";;"
}}