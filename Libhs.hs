-- every jump leaves (2^pow - 1) 
pow2Search x xs = inner 1 1 0
    where inner dir pow ix = let xi = (xs !! ix)
                                 c = cmp x xi
                             in case c*dir of 0 -> ix
                                              1 -> inner dir (pow*2) (ix+dir*pow)
                                              _ -> if pow == 1 then -1 else inner (-dir) 1 (ix-1)

cmp x y | x > y = 1
        | x < y = -1
        | otherwise = 0