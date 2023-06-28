package org.jahia.modules.contenteditor.api.forms;

import java.util.Comparator;

public class RankedComparator implements Comparator<Ranked>{
    public static final RankedComparator INSTANCE = new RankedComparator();

    @Override
    public int compare(Ranked o1, Ranked o2) {
        if (o1 == o2) {
            return 0;
        }

        if (o2 == null || o2.getRank() == null) {
            return -1;
        }

        if (o1 == null || o1.getRank() == null) {
            return 1;
        }

        if (!o1.getRank().equals(o2.getRank())) {
            return o1.getRank().compareTo(o2.getRank());
        }
        return o1.getName().compareTo(o2.getName());    }
}
